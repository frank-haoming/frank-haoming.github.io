// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "Blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-publications",
          title: "Publications",
          description: "Selected publications on AI-enhanced education, learning analytics, and bibliometrics.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-call-for-papers",
          title: "Call for Papers",
          description: "Curated academic opportunities in Edu. Auto-updated daily.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cfp/";
          },
        },{id: "nav-journal-rankings",
          title: "Journal Rankings",
          description: "HM Score combines journal quality metrics and author-friendliness",
          section: "Navigation",
          handler: () => {
            window.location.href = "/jrank/";
          },
        },{id: "nav-projects",
          title: "Projects",
          description: "Research projects on AI-powered educational innovations.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-life-line",
          title: "Life Line",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/lifeline/";
          },
        },{id: "post-openclaw-ecnu-ai-setup-series-overview",
        
          title: "OpenClaw × ECNU AI: Setup Series Overview",
        
        description: "A guide to the three OpenClaw setup posts: retrieving API credentials, completing the local installation, and connecting a Feishu bot.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/openclaw-series/";
          
        },
      },{id: "post-openclaw-setup-iii-connect-a-feishu-bot",
        
          title: "OpenClaw Setup (III): Connect a Feishu Bot",
        
        description: "Extend OpenClaw into Feishu by enabling the plugin, creating an app, importing permissions, and configuring event subscriptions.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/openclaw-tutorial-3/";
          
        },
      },{id: "post-openclaw-setup-ii-install-openclaw-and-connect-ecnu-ai",
        
          title: "OpenClaw Setup (II): Install OpenClaw and Connect ECNU AI",
        
        description: "Install OpenClaw locally, connect it to the ECNU AI platform, and verify that the environment works end to end.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/openclaw-tutorial-2/";
          
        },
      },{id: "post-openclaw-setup-i-retrieve-ecnu-ai-api-credentials",
        
          title: "OpenClaw Setup (I): Retrieve ECNU AI API Credentials",
        
        description: "Retrieve the API key, base URL, and model name from ChatECNU before connecting OpenClaw.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/openclaw-tutorial-1/";
          
        },
      },{id: "post-advanced-vosviewer-tutorial-from-data-cleaning-to-custom-coordinates",
        
          title: "Advanced VOSviewer Tutorial: From Data Cleaning to Custom Coordinates",
        
        description: "A step-by-step guide on visualizing bibliometric networks using custom layouts.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Vos/";
          
        },
      },{id: "news-presented-at-isls-2025-annual-meeting-in-helsinki-finland-and-aera-2025-in-colorado-usa",
          title: 'Presented at ISLS 2025 Annual Meeting in Helsinki, Finland and AERA 2025 in...',
          description: "",
          section: "News",},{id: "news-awarded-the-national-scholarship-top-2-of-postgraduates",
          title: 'Awarded the National Scholarship (Top 2% of Postgraduates).',
          description: "",
          section: "News",},{id: "news-poster-presentation-at-emnlp-2025-in-suzhou-china",
          title: 'Poster presentation at EMNLP 2025 in Suzhou, China.',
          description: "",
          section: "News",},{id: "news-admitted-to-tsinghua-university-beginning-doctoral-studies-this-autumn",
          title: 'Admitted to Tsinghua University — beginning doctoral studies this autumn.',
          description: "",
          section: "News",},{id: "projects-gai-元宇宙-联动赋能-虚拟学习空间的模式构建及应用开发",
          title: '“GAI+元宇宙”联动赋能：虚拟学习空间的模式构建及应用开发',
          description: "教育信息技术系应用性研究项目介绍",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%77%66%72%61%6E%6B%30%32%32%32@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0000-0003-1577-1628", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=RkLnsEwAAAAJ", "_blank");
        },
      },];
