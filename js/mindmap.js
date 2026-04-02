/**
 * Schematic Evolution — MindMap Renderer v2.0
 * NotebookLM-style: light, pill nodes, thin bezier curves, soft shadows
 */
class MindMap {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.collapsed = new Set();
    this.currentData = null;
    this.tooltip = document.getElementById('tooltip');
    this.NODE_W = 218; this.NODE_H = 48;
    this.GAP_X = 32;   this.GAP_Y = 80;
    this.ANIM = 380;
    this._initSVG();
    window.addEventListener('resize', () => { if(this.currentData){ this._initSVG(); this.render(this.currentData); }});
  }

  _initSVG() {
    d3.select(this.container).selectAll('*').remove();
    this.w = this.container.clientWidth || window.innerWidth - 260;
    this.h = this.container.clientHeight || window.innerHeight - 70;
    this.svg = d3.select(this.container).append('svg')
      .attr('width','100%').attr('height','100%').style('overflow','hidden');
    this._addDefs();
    this.zoomG = this.svg.append('g');
    this.linksG = this.zoomG.append('g');
    this.nodesG = this.zoomG.append('g');
    this.zoom = d3.zoom().scaleExtent([0.08,4]).on('zoom', e => this.zoomG.attr('transform', e.transform));
    this.svg.call(this.zoom).on('dblclick.zoom', null);
  }

  _addDefs() {
    const defs = this.svg.append('defs');

    // Subtle dot grid — light gray
    defs.append('pattern').attr('id','dotgrid').attr('width',28).attr('height',28)
      .attr('patternUnits','userSpaceOnUse').append('circle')
      .attr('cx',1).attr('cy',1).attr('r',0.9).attr('fill','#CBD5E1');
    this.svg.insert('rect',':first-child')
      .attr('width','100%').attr('height','100%').attr('fill','#F8FAFC');
    this.svg.insert('rect',':nth-child(2)')
      .attr('width','100%').attr('height','100%').attr('fill','url(#dotgrid)').attr('opacity',0.6);

    // Node shadow filter
    const s = defs.append('filter').attr('id','node-shadow')
      .attr('x','-20%').attr('y','-20%').attr('width','140%').attr('height','160%');
    s.append('feDropShadow').attr('dx',0).attr('dy',2).attr('stdDeviation',4)
      .attr('flood-color','#0F172A').attr('flood-opacity',0.08);

    // Root shadow (stronger + colored)
    const rs = defs.append('filter').attr('id','root-shadow')
      .attr('x','-30%').attr('y','-30%').attr('width','160%').attr('height','180%');
    rs.append('feDropShadow').attr('dx',0).attr('dy',4).attr('stdDeviation',10)
      .attr('flood-color','#6366F1').attr('flood-opacity',0.18);

    // Category shadow
    Object.entries(COLORS.categories).forEach(([key, cat]) => {
      const cf = defs.append('filter').attr('id',`cat-shadow-${key}`)
        .attr('x','-25%').attr('y','-25%').attr('width','150%').attr('height','170%');
      cf.append('feDropShadow').attr('dx',0).attr('dy',3).attr('stdDeviation',6)
        .attr('flood-color', cat.border).attr('flood-opacity',0.12);
    });
  }

  render(data) {
    this.currentData = data;
    if (!data) return;
    const root = this._hierarchy(data);
    const layout = this._layout(root);
    this._drawLinks(layout);
    this._drawNodes(layout);
    this._center(layout);
  }

  _hierarchy(data) {
    return d3.hierarchy(data, d => this.collapsed.has(d.id) ? null : (d.children?.length ? d.children : null));
  }

  _layout(root) {
    d3.tree().nodeSize([this.NODE_W + this.GAP_X, this.NODE_H + this.GAP_Y])(root);
    root.each(n => { n.x = -n.x; }); // RTL
    return root;
  }

  _drawLinks(root) {
    this.linksG.selectAll('.edge').data(root.links(), d => `${d.source.data.id}-${d.target.data.id}`)
      .join(
        e => e.append('path').attr('class','edge').attr('opacity',0)
          .call(s => s.transition().duration(this.ANIM).attr('opacity',1)),
        u => u.call(s => s.transition().duration(this.ANIM)),
        x => x.call(s => s.transition().duration(200).attr('opacity',0).remove())
      )
      .attr('d', d => {
        const sx=d.source.x, sy=d.source.y+this.NODE_H/2+1;
        const tx=d.target.x, ty=d.target.y-this.NODE_H/2-3;
        const my=(sy+ty)/2;
        return `M${sx},${sy} C${sx},${my} ${tx},${my} ${tx},${ty}`;
      })
      .attr('fill','none')
      .attr('stroke', d => COLORS.getCategory(d.target.data.category).border)
      .attr('stroke-width', d => d.target.depth===1 ? 1.5 : 1)
      .attr('stroke-opacity', d => d.target.depth===1 ? 0.35 : 0.22)
      .attr('stroke-linecap','round');
  }

  _drawNodes(root) {
    const self = this;
    this.nodesG.selectAll('.node').data(root.descendants(), d => d.data.id)
      .join(
        e => {
          const g = e.append('g').attr('class','node').attr('opacity',0)
            .attr('transform', d => `translate(${d.x-self.NODE_W/2},${d.y-self.NODE_H/2})`)
            .style('cursor', d => d.data.children?.length ? 'pointer' : 'default');
          self._buildNode(g);
          g.on('click', (e,d) => self._toggle(d))
           .on('mouseenter', (e,d) => { self._hoverIn(e,d); self._tip(e,d); })
           .on('mouseleave', (e,d) => { self._hoverOut(e,d); self._untip(); });
          g.transition().duration(self.ANIM)
            .attr('opacity',1)
            .attr('transform', d => `translate(${d.x-self.NODE_W/2},${d.y-self.NODE_H/2})`);
          return g;
        },
        u => u.call(s => s.transition().duration(self.ANIM)
          .attr('transform', d => `translate(${d.x-self.NODE_W/2},${d.y-self.NODE_H/2})`)
          .attr('opacity',1)),
        x => x.call(s => s.transition().duration(200).attr('opacity',0).remove())
      );
  }

  _buildNode(sel) {
    const W=this.NODE_W, H=this.NODE_H, self=this;
    sel.each(function(d) {
      const g = d3.select(this);
      const cat = COLORS.getCategory(d.data.category);
      const isRoot = d.depth===0, isCat = d.depth===1;
      const hasKids = d.data.children?.length > 0;
      const collapsed = self.collapsed.has(d.data.id);
      const rx = H / 2; // pill shape

      // Background pill
      const bg = isRoot ? cat.bg : isCat ? cat.bg : '#FFFFFF';
      const strokeW = isRoot ? 2 : isCat ? 1.5 : 1;
      const strokeOp = isRoot ? 1 : isCat ? 0.65 : 0.30;
      const filterRef = isRoot ? 'url(#root-shadow)' : isCat ? `url(#cat-shadow-${d.data.category})` : 'url(#node-shadow)';

      g.append('rect')
        .attr('class','node-bg')
        .attr('width', W).attr('height', H).attr('rx', rx)
        .attr('fill', bg)
        .attr('stroke', cat.border).attr('stroke-width', strokeW)
        .attr('stroke-opacity', strokeOp)
        .attr('filter', filterRef);

      // Left accent (colored dot for root/category, small for leaf)
      if (isRoot) {
        g.append('circle').attr('cx', rx).attr('cy', H/2).attr('r', 7)
          .attr('fill', cat.border).attr('opacity', 0.9);
        g.append('text').attr('x', rx).attr('y', H/2+4.5).attr('text-anchor','middle')
          .attr('font-size', 9).attr('fill','#fff').text('🧠').attr('dominant-baseline','auto');
      } else if (isCat) {
        g.append('circle').attr('cx', rx).attr('cy', H/2).attr('r', 5)
          .attr('fill', cat.border).attr('opacity', 0.8);
      } else {
        g.append('circle').attr('cx', rx).attr('cy', H/2).attr('r', 3)
          .attr('fill', cat.border).attr('opacity', 0.5);
      }

      // Name text
      const textXEnd = W - (hasKids ? 24 : 14);
      const textXStart = isRoot ? rx*2+6 : isCat ? rx*2+4 : rx*2+2;
      const textY = H/2 + (isCat && d.data.count ? -5 : 5);

      const nameEl = g.append('text')
        .attr('x', textXEnd).attr('y', textY)
        .attr('text-anchor','end')
        .attr('fill', cat.text)
        .attr('font-size', isRoot ? 14 : isCat ? 13 : 11)
        .attr('font-weight', isRoot ? 700 : isCat ? 600 : 500)
        .attr('font-family','Heebo,sans-serif')
        .attr('dominant-baseline','auto');
      // Clip label to fit in node
      const label = d.data.nameHe || d.data.name || '';
      nameEl.text(label.length > 22 ? label.substring(0,21)+'…' : label);

      // Count badge for category nodes
      if (d.data.count && isCat) {
        const bw = 28;
        g.append('rect').attr('x', rx*2+4).attr('y', H/2+2).attr('width', bw)
          .attr('height', 14).attr('rx', 7)
          .attr('fill', cat.border).attr('opacity', 0.15);
        g.append('text').attr('x', rx*2+4+bw/2).attr('y', H/2+11.5)
          .attr('text-anchor','middle')
          .attr('fill', cat.border).attr('font-size', 9).attr('font-weight', 700)
          .attr('font-family','Heebo,sans-serif').text(d.data.count);
      }

      // Expand/collapse indicator
      if (hasKids) {
        g.append('circle').attr('cx', W-13).attr('cy', H/2).attr('r', 7)
          .attr('fill', cat.border).attr('opacity', 0.12)
          .attr('class','toggle-circle');
        g.append('text').attr('x', W-13).attr('y', H/2+4)
          .attr('text-anchor','middle')
          .attr('fill', cat.border).attr('font-size', 10).attr('font-weight', 700)
          .attr('font-family','Heebo,sans-serif').attr('class','toggle-text')
          .text(collapsed ? '+' : '−');
      }

      // Tag badge (leaf nodes)
      if (!isRoot && !isCat && d.data.tag) {
        const tagX = rx*2+2, tagY = H/2+5;
        g.append('text').attr('x', tagX).attr('y', tagY)
          .attr('text-anchor','start')
          .attr('fill', cat.border).attr('font-size', 9).attr('font-weight', 600)
          .attr('font-family','Heebo,sans-serif').attr('opacity', 0.7)
          .text(d.data.tag.length>8 ? d.data.tag.substring(0,8)+'…' : d.data.tag);
      }
    });
  }

  _hoverIn(e, d) {
    const node = d3.select(e.currentTarget);
    node.raise();
    node.select('.node-bg')
      .transition().duration(120)
      .attr('stroke-width', d.depth===0 ? 2.5 : d.depth===1 ? 2 : 1.5)
      .attr('stroke-opacity', 1);
    node.transition().duration(120)
      .attr('transform', `translate(${d.x-this.NODE_W/2},${d.y-this.NODE_H/2}) scale(1.035)`)
      .style('filter','brightness(0.97)');
  }

  _hoverOut(e, d) {
    const node = d3.select(e.currentTarget);
    const cat = COLORS.getCategory(d.data.category);
    const strokeOp = d.depth===0 ? 1 : d.depth===1 ? 0.65 : 0.30;
    const strokeW = d.depth===0 ? 2 : d.depth===1 ? 1.5 : 1;
    node.select('.node-bg')
      .transition().duration(180)
      .attr('stroke-width', strokeW)
      .attr('stroke-opacity', strokeOp);
    node.transition().duration(180)
      .attr('transform', `translate(${d.x-this.NODE_W/2},${d.y-this.NODE_H/2})`)
      .style('filter', null);
  }

  _toggle(d) {
    if (!d.data.children?.length) return;
    this.collapsed.has(d.data.id) ? this.collapsed.delete(d.data.id) : this.collapsed.add(d.data.id);
    this.linksG.selectAll('*').remove();
    this.nodesG.selectAll('*').remove();
    const r = this._hierarchy(this.currentData), l = this._layout(r);
    this._drawLinks(l); this._drawNodes(l);
  }

  _tip(e, d) {
    if (!this.tooltip) return;
    const cat = COLORS.getCategory(d.data.category);
    const desc = d.data.description || d.data.purpose || d.data.he || '';
    this.tooltip.innerHTML = `
      <div style="color:${cat.border};font-weight:700;margin-bottom:5px;font-size:13px">${d.data.nameHe||d.data.name}</div>
      ${desc ? `<div style="color:#475569;font-size:12px;line-height:1.5">${desc.substring(0,120)}</div>` : ''}
      ${d.data.count ? `<div style="color:${cat.border};font-size:11px;margin-top:5px;font-weight:600">${d.data.count} פריטים</div>` : ''}
      ${d.data.status ? `<div style="font-size:10px;color:#94A3B8;margin-top:3px">${d.data.status}</div>` : ''}
    `;
    this.tooltip.style.display = 'block';
    const tw=240, left = e.clientX+14>window.innerWidth-tw-10 ? e.clientX-tw-14 : e.clientX+14;
    const top = e.clientY+120>window.innerHeight ? e.clientY-120 : e.clientY-10;
    this.tooltip.style.left = left+'px';
    this.tooltip.style.top = top+'px';
  }

  _untip() { if (this.tooltip) this.tooltip.style.display = 'none'; }

  _center(root) {
    let minX=Infinity, maxX=-Infinity;
    root.each(n => { minX=Math.min(minX,n.x-this.NODE_W/2); maxX=Math.max(maxX,n.x+this.NODE_W/2); });
    const cx=(minX+maxX)/2, scale=Math.min(1,(this.w-80)/(maxX-minX));
    this.svg.transition().duration(500)
      .call(this.zoom.transform, d3.zoomIdentity.translate(this.w/2-cx*scale,60).scale(scale));
  }

  resetView() { if(this.currentData){ const r=this._hierarchy(this.currentData); this._center(this._layout(r)); } }
  expandAll() { this.collapsed.clear(); this._rebuild(); }
  collapseAll() { this.currentData?.children?.forEach(c=>c.id&&this.collapsed.add(c.id)); this._rebuild(); }
  _rebuild() {
    this.linksG.selectAll('*').remove(); this.nodesG.selectAll('*').remove();
    const r=this._hierarchy(this.currentData), l=this._layout(r);
    this._drawLinks(l); this._drawNodes(l);
  }
}
