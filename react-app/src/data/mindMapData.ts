export interface MindMapNodeData {
  id: string;
  name: string;
  type: 'root' | 'folder' | 'skill' | 'plugin' | 'file' | 'agent' | 'tool' | 'reference';
  color?: string;
  description?: string;
  children?: MindMapNodeData[];
}

export const mindMapData: MindMapNodeData = { id: 'root',
  name: 'אבולוציה סכמטית',
  type: 'root',
  color: '#6366F1',
  description: 'מפת מערכת Claude — סוכנים, סקילים, מצבים, MCP ופרויקטים',
  children: [
    { id: 'agents',
      name: 'סוכנים',
      type: 'folder',
      color: '#EF4444',
      description: '35 סוכנים מתמחים',
      children: [
        { id: 'agents-arch',
          name: 'ארכיטקטורה ותכנון',
          type: 'folder',
          color: '#EF4444',
          children: [
            { id: 'ag-architect',
              name: 'architect',
              type: 'agent',
              color: '#EF4444'
            },
            { id: 'ag-planner',
              name: 'planner',
              type: 'agent',
              color: '#EF4444'
            },
            { id: 'ag-tdd_guide',
              name: 'tdd-guide',
              type: 'agent',
              color: '#EF4444'
            },
          ]
        },
        { id: 'agents-review',
          name: 'ביקורת קוד',
          type: 'folder',
          color: '#F87171',
          children: [
            { id: 'ag-code_reviewer',
              name: 'code-reviewer',
              type: 'agent',
              color: '#F87171'
            },
            { id: 'ag-cpp_reviewer',
              name: 'cpp-reviewer',
              type: 'agent',
              color: '#F87171'
            },
            { id: 'ag-database_reviewer',
              name: 'database-reviewer',
              type: 'agent',
              color: '#F87171'
            },
            { id: 'ag-flutter_reviewer',
              name: 'flutter-reviewer',
              type: 'agent',
              color: '#F87171'
            },
            { id: 'ag-go_reviewer',
              name: 'go-reviewer',
              type: 'agent',
              color: '#F87171'
            },
            { id: 'ag-java_reviewer',
              name: 'java-reviewer',
              type: 'agent',
              color: '#F87171'
            },
            { id: 'ag-kotlin_reviewer',
              name: 'kotlin-reviewer',
              type: 'agent',
              color: '#F87171'
            },
            { id: 'ag-python_reviewer',
              name: 'python-reviewer',
              type: 'agent',
              color: '#F87171'
            },
            { id: 'ag-rust_reviewer',
              name: 'rust-reviewer',
              type: 'agent',
              color: '#F87171'
            },
            { id: 'ag-security_reviewer',
              name: 'security-reviewer',
              type: 'agent',
              color: '#F87171'
            },
            { id: 'ag-typescript_reviewer',
              name: 'typescript-reviewer',
              type: 'agent',
              color: '#F87171'
            },
          ]
        },
        { id: 'agents-build',
          name: 'פתרון Build',
          type: 'folder',
          color: '#DC2626',
          children: [
            { id: 'ag-build_error_resolver',
              name: 'build-error-resolver',
              type: 'agent',
              color: '#DC2626'
            },
            { id: 'ag-cpp_build_resolver',
              name: 'cpp-build-resolver',
              type: 'agent',
              color: '#DC2626'
            },
            { id: 'ag-go_build_resolver',
              name: 'go-build-resolver',
              type: 'agent',
              color: '#DC2626'
            },
            { id: 'ag-java_build_resolver',
              name: 'java-build-resolver',
              type: 'agent',
              color: '#DC2626'
            },
            { id: 'ag-kotlin_build_resolver',
              name: 'kotlin-build-resolver',
              type: 'agent',
              color: '#DC2626'
            },
            { id: 'ag-pytorch_build_resolver',
              name: 'pytorch-build-resolver',
              type: 'agent',
              color: '#DC2626'
            },
            { id: 'ag-rust_build_resolver',
              name: 'rust-build-resolver',
              type: 'agent',
              color: '#DC2626'
            },
          ]
        },
        { id: 'agents-ops',
          name: 'תפעול',
          type: 'folder',
          color: '#B91C1C',
          children: [
            { id: 'ag-backup_agent',
              name: 'backup-agent',
              type: 'agent',
              color: '#B91C1C'
            },
            { id: 'ag-bug_learner',
              name: 'bug-learner',
              type: 'agent',
              color: '#B91C1C'
            },
            { id: 'ag-doc_updater',
              name: 'doc-updater',
              type: 'agent',
              color: '#B91C1C'
            },
            { id: 'ag-e2e_runner',
              name: 'e2e-runner',
              type: 'agent',
              color: '#B91C1C'
            },
            { id: 'ag-harness_optimizer',
              name: 'harness-optimizer',
              type: 'agent',
              color: '#B91C1C'
            },
            { id: 'ag-loop_operator',
              name: 'loop-operator',
              type: 'agent',
              color: '#B91C1C'
            },
            { id: 'ag-refactor_cleaner',
              name: 'refactor-cleaner',
              type: 'agent',
              color: '#B91C1C'
            },
          ]
        },
        { id: 'agents-special',
          name: 'ייחודיים',
          type: 'folder',
          color: '#991B1B',
          children: [
            { id: 'ag-chadshani_optimizer',
              name: 'chadshani-optimizer',
              type: 'agent',
              color: '#991B1B'
            },
            { id: 'ag-chief_of_staff',
              name: 'chief-of-staff',
              type: 'agent',
              color: '#991B1B'
            },
            { id: 'ag-docs_lookup',
              name: 'docs-lookup',
              type: 'agent',
              color: '#991B1B'
            },
            { id: 'ag-notice_manager',
              name: 'notice-manager',
              type: 'agent',
              color: '#991B1B'
            },
            { id: 'ag-order_guard',
              name: 'order-guard',
              type: 'agent',
              color: '#991B1B'
            },
            { id: 'ag-project_status',
              name: 'project-status',
              type: 'agent',
              color: '#991B1B'
            },
            { id: 'ag-README',
              name: 'README',
              type: 'agent',
              color: '#991B1B'
            },
          ]
        },
      ]
    },
    { id: 'skills',
      name: 'סקילים',
      type: 'folder',
      color: '#3B82F6',
      description: '18 סקילים פעילים',
      children: [
        { id: 'skills-dev',
          name: 'פיתוח ובדיקות',
          type: 'folder',
          color: '#3B82F6',
          children: [
            { id: 'sk-ai_regression_testing',
              name: 'ai-regression-testing',
              type: 'skill',
              color: '#3B82F6'
            },
            { id: 'sk-e2e_testing',
              name: 'e2e-testing',
              type: 'skill',
              color: '#3B82F6'
            },
            { id: 'sk-eval_harness',
              name: 'eval-harness',
              type: 'skill',
              color: '#3B82F6'
            },
            { id: 'sk-tdd_workflow',
              name: 'tdd-workflow',
              type: 'skill',
              color: '#3B82F6'
            },
            { id: 'sk-verification_loop',
              name: 'verification-loop',
              type: 'skill',
              color: '#3B82F6'
            },
          ]
        },
        { id: 'skills-design',
          name: 'עיצוב ועדכון',
          type: 'folder',
          color: '#60A5FA',
          children: [
            { id: 'sk-frontend_design',
              name: 'frontend-design',
              type: 'skill',
              color: '#60A5FA'
            },
          ]
        },
        { id: 'skills-learn',
          name: 'למידה ושיפור',
          type: 'folder',
          color: '#93C5FD',
          children: [
            { id: 'sk-continuous_learning',
              name: 'continuous-learning',
              type: 'skill',
              color: '#93C5FD'
            },
            { id: 'sk-continuous_learning_v2',
              name: 'continuous-learning-v2',
              type: 'skill',
              color: '#93C5FD'
            },
            { id: 'sk-ideation',
              name: 'ideation',
              type: 'skill',
              color: '#93C5FD'
            },
            { id: 'sk-iterative_retrieval',
              name: 'iterative-retrieval',
              type: 'skill',
              color: '#93C5FD'
            },
            { id: 'sk-strategic_compact',
              name: 'strategic-compact',
              type: 'skill',
              color: '#93C5FD'
            },
          ]
        },
        { id: 'skills-infra',
          name: 'תשתית',
          type: 'folder',
          color: '#BFDBFE',
          children: [
            { id: 'sk-chadshani_quality_control',
              name: 'chadshani_quality_control',
              type: 'skill',
              color: '#BFDBFE'
            },
            { id: 'sk-configure_ecc',
              name: 'configure-ecc',
              type: 'skill',
              color: '#BFDBFE'
            },
            { id: 'sk-gemini_api_dev',
              name: 'gemini-api-dev',
              type: 'skill',
              color: '#BFDBFE'
            },
            { id: 'sk-plankton_code_quality',
              name: 'plankton-code-quality',
              type: 'skill',
              color: '#BFDBFE'
            },
            { id: 'sk-project_guidelines_example',
              name: 'project-guidelines-example',
              type: 'skill',
              color: '#BFDBFE'
            },
            { id: 'sk-skill_creator',
              name: 'skill-creator',
              type: 'skill',
              color: '#BFDBFE'
            },
            { id: 'sk-skill_stocktake',
              name: 'skill-stocktake',
              type: 'skill',
              color: '#BFDBFE'
            },
          ]
        },
      ]
    },
    { id: 'modes',
      name: 'מצבי עבודה',
      type: 'folder',
      color: '#8B5CF6',
      description: '14 מצבים — shadow_agent תמיד פעיל',
      children: [
        { id: 'modes-auto',
          name: 'אוטומטיים',
          type: 'folder',
          color: '#8B5CF6',
          children: [
            { id: 'md-monthly-calibration-mode',
              name: 'monthly_calibration_mode',
              type: 'tool',
              color: '#8B5CF6',
              description: 'Runs automatically on the first session of every month,'
            },
            { id: 'md-project-closure-mode',
              name: 'project_closure_mode',
              type: 'tool',
              color: '#8B5CF6',
              description: 'You are operating in PROJECT CLOSURE MODE.'
            },
            { id: 'md-project-status-review-mode',
              name: 'project_status_review_mode',
              type: 'tool',
              color: '#8B5CF6',
              description: 'Also runs automatically at the start of the first session of'
            },
            { id: 'md-shadow-agent-mode',
              name: 'shadow_agent_mode',
              type: 'tool',
              color: '#8B5CF6',
              description: 'You are operating in SHADOW AGENT MODE.'
            },
          ]
        },
        { id: 'modes-manual',
          name: 'ידניים',
          type: 'folder',
          color: '#A78BFA',
          children: [
            { id: 'md-architect-mode',
              name: 'architect_mode',
              type: 'tool',
              color: '#A78BFA',
              description: 'You are operating as the system architect.'
            },
            { id: 'md-audit-mode',
              name: 'audit_mode',
              type: 'tool',
              color: '#A78BFA',
              description: 'You are operating in SAFETY ANALYSIS + INTEGRATION AUDIT MOD'
            },
            { id: 'md-build-mode',
              name: 'build_mode',
              type: 'tool',
              color: '#A78BFA',
              description: 'You are operating in CONTROLLED INFRASTRUCTURE EXECUTION MOD'
            },
            { id: 'md-consolidation-mode',
              name: 'consolidation_mode',
              type: 'tool',
              color: '#A78BFA',
              description: 'Run this 4-phase pass on all memory files:'
            },
            { id: 'md-document-ingestion-mode',
              name: 'document_ingestion_mode',
              type: 'tool',
              color: '#A78BFA',
              description: 'Runs automatically before reading any document over 200 line'
            },
            { id: 'md-evolution-pathways-mode',
              name: 'evolution_pathways_mode',
              type: 'tool',
              color: '#A78BFA',
              description: 'When user says: "רוצה להוסיף", "מצאתי כלי", "יש לי רעיון", "'
            },
            { id: 'md-external-skill-intake-mode',
              name: 'external_skill_intake_mode',
              type: 'tool',
              color: '#A78BFA',
              description: 'Every skill from outside the system — GitHub repo, MCP Marke'
            },
            { id: 'md-integration-mode',
              name: 'integration_mode',
              type: 'tool',
              color: '#A78BFA',
              description: 'You are operating in CONTROLLED INTEGRATIONS EXECUTION MODE.'
            },
            { id: 'md-knowledge-mode',
              name: 'knowledge_mode',
              type: 'tool',
              color: '#A78BFA',
              description: 'You are operating in KNOWLEDGE INTEGRATION MODE.'
            },
            { id: 'md-security-scan-mode',
              name: 'security_scan_mode',
              type: 'tool',
              color: '#A78BFA',
              description: 'This scan runs BEFORE the External Skill Intake Protocol.'
            },
          ]
        },
      ]
    },
    { id: 'mcp',
      name: 'שרתי MCP',
      type: 'folder',
      color: '#10B981',
      description: '15 שרתים פעילים',
      children: [
        { id: 'mcp-core',
          name: 'ליבה ופיתוח',
          type: 'folder',
          color: '#10B981',
          children: [
            { id: 'mcp-mcp2cli',
              name: 'mcp2cli',
              type: 'plugin',
              color: '#10B981',
              description: '** Routes MCP calls through CLI to reduce token consumption.'
            },
            { id: 'mcp-lobehub-_-market-cli',
              name: 'lobehub / market-cli',
              type: 'plugin',
              color: '#10B981',
              description: '** CLI for browsing and discovering MCP market tools.'
            },
            { id: 'mcp-buildwithclaude-_-mc',
              name: 'buildwithclaude / mcp-builder',
              type: 'plugin',
              color: '#10B981',
              description: '** Build custom MCP servers directly from Claude Code.'
            },
            { id: 'mcp-web-application-test',
              name: 'web-application-testing-toolkit (MCP Market)',
              type: 'plugin',
              color: '#10B981',
              description: '** Web application testing toolkit. Evaluate against existin'
            },
            { id: 'mcp-playwright-cli',
              name: 'Playwright CLI',
              type: 'plugin',
              color: '#10B981',
              description: '** Browser automation and end-to-end testing.'
            },
            { id: 'mcp-mcpmarket-_-figma-to',
              name: 'mcpmarket / figma-to-code',
              type: 'plugin',
              color: '#10B981',
              description: '** Figma to code conversion.'
            },
          ]
        },
        { id: 'mcp-ai',
          name: 'AI ועיצוב',
          type: 'folder',
          color: '#34D399',
          children: [
            { id: 'mcp-google-stitch-mcp',
              name: 'Google Stitch MCP',
              type: 'plugin',
              color: '#34D399',
              description: '** AI UI design tool (Google Labs, Gemini 2.5 Pro). Generate'
            },
            { id: 'mcp-fastmcp-_-ui-ux-pro-',
              name: 'fastmcp / ui-ux-pro-max',
              type: 'plugin',
              color: '#34D399',
              description: '** UI/UX skill from MCP market.'
            },
          ]
        },
        { id: 'mcp-thunder',
          name: 'Thunder Suite',
          type: 'folder',
          color: '#6EE7B7',
          children: [
            { id: 'mcp-orelliusai-_-claudeu',
              name: 'OrelliusAI / claudeusage-mcp',
              type: 'plugin',
              color: '#6EE7B7',
              description: '** Real-time Claude Pro/Max usage tracking — session, weekly'
            },
            { id: 'mcp-orelliusai-_-thunder',
              name: 'OrelliusAI / Thunder Dome',
              type: 'plugin',
              color: '#6EE7B7',
              description: '** MCP gateway with auth, rate limiting, logging. Sits betwe'
            },
            { id: 'mcp-orelliusai-_-thunder',
              name: 'OrelliusAI / Thunder Thinking',
              type: 'plugin',
              color: '#6EE7B7',
              description: '** Structured sequential thinking MCP server.'
            },
            { id: 'mcp-orelliusai-_-thunder',
              name: 'OrelliusAI / Thunder Eye',
              type: 'plugin',
              color: '#6EE7B7',
              description: '** Desktop app vision (screenshots, windows, screen).'
            },
          ]
        },
        { id: 'mcp-data',
          name: 'נתונים וניהול',
          type: 'folder',
          color: '#A7F3D0',
          children: [
            { id: 'mcp-[integration-name]',
              name: '[Integration Name]',
              type: 'plugin',
              color: '#A7F3D0',
              description: '**'
            },
            { id: 'mcp-tradingview-mcp',
              name: 'tradingview-mcp',
              type: 'plugin',
              color: '#A7F3D0',
              description: '** TradingView data access via MCP. Relevant for finance/tra'
            },
            { id: 'mcp-ruflo-(claude-flow)',
              name: 'Ruflo (claude-flow)',
              type: 'plugin',
              color: '#A7F3D0',
              description: '** Multi-agent swarm orchestration (259 MCP tools, 64 agents'
            },
          ]
        },
      ]
    },
    { id: 'projects',
      name: 'פרויקטים',
      type: 'folder',
      color: '#F59E0B',
      description: '8 פרויקטים',
      children: [
        { id: 'proj-1',
          name: 'גלגל הרגשות',
          type: 'reference',
          color: '#10B981',
          description: 'Complete — פרויקט היסטורי, ויזואליזציית רגשות | HTML/JS'
        },
        { id: 'proj-2',
          name: 'חדשני',
          type: 'reference',
          color: '#F59E0B',
          description: 'Maintenance — אתר חדשות וכלכלה בזמן אמת | Python'
        },
        { id: 'proj-3',
          name: 'התראות',
          type: 'reference',
          color: '#3B82F6',
          description: 'Active — מערכת התראות iPhone (ntfy.sh)'
        },
        { id: 'proj-4',
          name: 'שליטה מרחוק',
          type: 'reference',
          color: '#3B82F6',
          description: 'Active — גישה ללא השגחה למחשב הראשי'
        },
        { id: 'proj-5',
          name: 'סטיקר בוט',
          type: 'reference',
          color: '#3B82F6',
          description: 'Active — בוט ליצירת מדבקות ב-WhatsApp | Node.js, Python'
        },
        { id: 'proj-6',
          name: 'גיגיז',
          type: 'reference',
          color: '#94A3B8',
          description: 'Frozen — פלטפורמת עבודה (Gig Economy) | Python'
        },
        { id: 'proj-7',
          name: 'WhaleWatcher',
          type: 'reference',
          color: '#8B5CF6',
          description: 'Development — מעקב עסקאות לווייתנים בבורסה'
        },
        { id: 'proj-8',
          name: 'אבולוציה סכמטית',
          type: 'reference',
          color: '#3B82F6',
          description: 'Active — מפת מערכת ויזואלית של Claude | Python'
        },
      ]
    },
    { id: 'hooks',
      name: 'Hooks',
      type: 'folder',
      color: '#EC4899',
      description: '4 hooks',
      children: [
        { id: 'hook-pretooluse-1',
          name: 'PreToolUse',
          type: 'tool',
          color: '#EC4899'
        },
        { id: 'hook-posttooluse-1',
          name: 'PostToolUse',
          type: 'tool',
          color: '#F472B6'
        },
        { id: 'hook-posttooluse-2',
          name: 'PostToolUse',
          type: 'tool',
          color: '#F472B6'
        },
        { id: 'hook-precompact-1',
          name: 'PreCompact',
          type: 'tool',
          color: '#FBCFE8'
        },
      ]
    },
    { id: 'rules',
      name: 'כללים',
      type: 'folder',
      color: '#06B6D4',
      description: '65 כללים',
      children: [
        { id: 'rules-common',
          name: 'Common',
          type: 'folder',
          color: '#06B6D4',
          children: [
            { id: 'rule-coding-style',
              name: 'coding-style',
              type: 'file',
              color: '#06B6D4'
            },
            { id: 'rule-git-workflow',
              name: 'git-workflow',
              type: 'file',
              color: '#06B6D4'
            },
            { id: 'rule-testing',
              name: 'testing',
              type: 'file',
              color: '#06B6D4'
            },
            { id: 'rule-performance',
              name: 'performance',
              type: 'file',
              color: '#06B6D4'
            },
            { id: 'rule-security',
              name: 'security',
              type: 'file',
              color: '#06B6D4'
            },
            { id: 'rule-agents',
              name: 'agents',
              type: 'file',
              color: '#06B6D4'
            },
            { id: 'rule-patterns',
              name: 'patterns',
              type: 'file',
              color: '#06B6D4'
            },
            { id: 'rule-hooks',
              name: 'hooks',
              type: 'file',
              color: '#06B6D4'
            },
            { id: 'rule-development-workflow',
              name: 'development-workflow',
              type: 'file',
              color: '#06B6D4'
            },
          ]
        },
        { id: 'rules-langs',
          name: 'שפות',
          type: 'folder',
          color: '#22D3EE',
          children: [
            { id: 'rule-TypeScript',
              name: 'TypeScript',
              type: 'file',
              color: '#22D3EE'
            },
            { id: 'rule-Python',
              name: 'Python',
              type: 'file',
              color: '#22D3EE'
            },
            { id: 'rule-Go',
              name: 'Go',
              type: 'file',
              color: '#22D3EE'
            },
            { id: 'rule-Rust',
              name: 'Rust',
              type: 'file',
              color: '#22D3EE'
            },
            { id: 'rule-C++',
              name: 'C++',
              type: 'file',
              color: '#22D3EE'
            },
            { id: 'rule-Java',
              name: 'Java',
              type: 'file',
              color: '#22D3EE'
            },
            { id: 'rule-Kotlin',
              name: 'Kotlin',
              type: 'file',
              color: '#22D3EE'
            },
            { id: 'rule-PHP',
              name: 'PHP',
              type: 'file',
              color: '#22D3EE'
            },
          ]
        },
      ]
    },
  ]
};
