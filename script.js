// GitHub API Configuration
const GITHUB_USERNAME = 'ZacharyLabor';
const GITHUB_API_BASE = 'https://api.github.com';

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const backToTopBtn = document.getElementById('back-to-top');

// GitHub Data Elements
const githubName = document.getElementById('github-name');
const githubBio = document.getElementById('github-bio');
const githubAvatar = document.getElementById('github-avatar');
const githubLocation = document.getElementById('github-location');
const githubEmail = document.getElementById('github-email');
const githubCreated = document.getElementById('github-created');
const githubProfileLink = document.getElementById('github-profile-link');
const emailLink = document.getElementById('email-link');
const repoCount = document.getElementById('repo-count');
const followersCount = document.getElementById('followers-count');
const followingCount = document.getElementById('following-count');
const projectsContainer = document.getElementById('projects-container');
const skillsContainer = document.getElementById('skills-container');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after a delay
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);

    // Initialize all functionality
    initNavigation();
    initScrollEffects();
    initAnimations();
    // Initialize GitHub data only (skills section was removed)
    fetchGitHubData();
    initContactForm();
    initProjectFilters();
    initSkillBars();

// Initialize skill progress bars animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 200);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
}
});

// Navigation functionality
function initNavigation() {
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll effects
function initScrollEffects() {
    // Back to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Navbar background on scroll
        const navbar = document.querySelector('.navbar');
        if (window.pageYOffset > 50) {
            navbar.style.background = 'rgba(10, 22, 40, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 22, 40, 0.95)';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });
}

// Initialize animations
function initAnimations() {
    // Add animation classes to elements
    document.querySelectorAll('.skill-card').forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.1}s`;
    });

    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Typing animation for hero text
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        typingText.style.borderRight = '2px solid white';
        typingText.style.animation = 'typing 2s steps(8) 1s both, blink 1s infinite';
    }
}

// Fetch GitHub data
async function fetchGitHubData() {
    try {
        // Fetch user profile
        const userResponse = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`);
        const userData = await userResponse.json();

        // Fetch repositories
        const reposResponse = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        const reposData = await reposResponse.json();

        // Update profile information
        updateProfileInfo(userData);
        
        // Update repositories
        updateProjects(reposData);
        
        // Generate skills from repositories
        generateSkills(reposData);

        // Animate counters
        animateCounters(userData);

    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        // Fallback data
        updateProfileInfo({
            name: 'Zachary Labor',
            bio: 'Full Stack Developer & Problem Solver',
            avatar_url: 'https://via.placeholder.com/300',
            location: 'Location not specified',
            email: null,
            created_at: '2024-01-01T00:00:00Z',
            html_url: 'https://github.com/ZacharyLabor',
            public_repos: 0,
            followers: 0,
            following: 0
        });
    }
}

// Update profile information
function updateProfileInfo(userData) {
    if (githubName) githubName.textContent = userData.name || userData.login || 'Zachary Labor';
    if (githubBio) githubBio.textContent = userData.bio || 'Full Stack Developer & Problem Solver';
    if (githubAvatar) githubAvatar.src = userData.avatar_url || 'https://via.placeholder.com/300';
    if (githubLocation) githubLocation.textContent = userData.location || 'Location not specified';
    if (githubEmail) githubEmail.textContent = userData.email || 'Email not public';
    if (githubCreated) {
        const createdDate = new Date(userData.created_at);
        githubCreated.textContent = createdDate.getFullYear();
    }
    if (githubProfileLink) githubProfileLink.href = userData.html_url || 'https://github.com/ZacharyLabor';
    if (emailLink && userData.email) {
        emailLink.href = `mailto:${userData.email}`;
    }

    // Update detailed bio in about section
    const detailedBio = document.getElementById('github-detailed-bio');
    if (detailedBio) {
        detailedBio.textContent = userData.bio || "I'm a passionate developer who loves creating innovative solutions and learning new technologies. I enjoy working on challenging projects and collaborating with other developers to build amazing applications.";
    }
}

// Animate counters
function animateCounters(userData) {
    const counters = [
        { element: repoCount, target: userData.public_repos || 0 },
        { element: followersCount, target: userData.followers || 0 },
        { element: followingCount, target: userData.following || 0 }
    ];

    counters.forEach(counter => {
        if (counter.element) {
            animateCounter(counter.element, counter.target);
        }
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

// Update projects from repositories
function updateProjects(repos) {
    if (!projectsContainer) return;

    // Add sample projects if no repos are available or to supplement existing ones
    const sampleProjects = [
        {
            name: "AI-Powered Task Manager",
            description: "A smart task management application with AI-driven priority suggestions and automated scheduling using machine learning algorithms.",
            language: "Python",
            html_url: "https://github.com/ZacharyLabor/ai-task-manager",
            homepage: "https://ai-taskmanager-demo.netlify.app",
            updated_at: "2024-01-15T10:30:00Z",
            topics: ["ai", "machine-learning", "productivity", "flask", "react"]
        },
        {
            name: "Blockchain Voting System",
            description: "Secure and transparent voting platform built on Ethereum blockchain with smart contracts for tamper-proof elections.",
            language: "Solidity",
            html_url: "https://github.com/ZacharyLabor/blockchain-voting",
            homepage: "https://blockchain-vote-demo.vercel.app",
            updated_at: "2024-01-10T14:20:00Z",
            topics: ["blockchain", "ethereum", "smart-contracts", "web3", "solidity"]
        },
        {
            name: "Real-time Chat Application",
            description: "Modern chat application with real-time messaging, file sharing, and video calls using WebRTC and Socket.io.",
            language: "JavaScript",
            html_url: "https://github.com/ZacharyLabor/realtime-chat",
            homepage: "https://realtime-chat-app.herokuapp.com",
            updated_at: "2024-01-08T16:45:00Z",
            topics: ["websockets", "webrtc", "nodejs", "react", "mongodb"]
        },
        {
            name: "E-commerce Analytics Dashboard",
            description: "Comprehensive analytics dashboard for e-commerce businesses with real-time sales tracking and predictive analytics.",
            language: "TypeScript",
            html_url: "https://github.com/ZacharyLabor/ecommerce-analytics",
            homepage: "https://ecommerce-analytics-demo.com",
            updated_at: "2024-01-05T09:15:00Z",
            topics: ["analytics", "dashboard", "typescript", "nextjs", "postgresql"]
        },
        {
            name: "Mobile Fitness Tracker",
            description: "Cross-platform mobile app for fitness tracking with workout plans, nutrition logging, and progress visualization.",
            language: "Dart",
            html_url: "https://github.com/ZacharyLabor/fitness-tracker",
            homepage: null,
            updated_at: "2024-01-03T11:30:00Z",
            topics: ["flutter", "mobile", "fitness", "health", "sqlite"]
        },
        {
            name: "DevOps Automation Suite",
            description: "Complete DevOps automation toolkit with CI/CD pipelines, infrastructure as code, and monitoring solutions.",
            language: "Go",
            html_url: "https://github.com/ZacharyLabor/devops-suite",
            homepage: "https://devops-suite-docs.com",
            updated_at: "2024-01-01T08:00:00Z",
            topics: ["devops", "kubernetes", "docker", "terraform", "monitoring"]
        }
    ];

    // Combine real repos with sample projects, prioritizing real repos
    const allProjects = [...repos, ...sampleProjects];
    
    // Filter and sort repositories
    const featuredRepos = allProjects
        .filter(repo => !repo.fork && repo.description) // Exclude forks and repos without description
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 6); // Show top 6 repositories

    projectsContainer.innerHTML = '';

    if (featuredRepos.length === 0) {
        projectsContainer.innerHTML = `
            <div class="no-projects">
                <p>No public repositories found. Projects will be displayed here once available.</p>
            </div>
        `;
        return;
    }

    featuredRepos.forEach((repo, index) => {
        const projectCard = createProjectCard(repo);
        projectCard.classList.add('fade-in');
        projectCard.style.animationDelay = `${index * 0.1}s`;
        projectsContainer.appendChild(projectCard);
    });
}

// Create project card
function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-category', getRepoCategory(repo.language));

    const techTags = getTechTags(repo);
    
    card.innerHTML = `
        <div class="project-header">
            <h3 class="project-title">${repo.name}</h3>
            <p class="project-description">${repo.description || 'No description available'}</p>
        </div>
        <div class="project-tech">
            ${techTags.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
        <div class="project-links">
            <a href="${repo.html_url}" target="_blank" class="project-link">
                <i class="fab fa-github"></i>
                View Code
            </a>
            ${repo.homepage ? `
                <a href="${repo.homepage}" target="_blank" class="project-link">
                    <i class="fas fa-external-link-alt"></i>
                    Live Demo
                </a>
            ` : ''}
        </div>
    `;

    return card;
}

// Get repository category based on language
function getRepoCategory(language) {
    if (!language) return 'other';
    
    const webLanguages = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Vue', 'React'];
    const pythonLanguages = ['Python'];
    const jsLanguages = ['JavaScript', 'TypeScript', 'Node.js'];

    if (webLanguages.includes(language)) return 'web';
    if (pythonLanguages.includes(language)) return 'python';
    if (jsLanguages.includes(language)) return 'javascript';
    
    return 'other';
}

// Get tech tags for repository
function getTechTags(repo) {
    const tags = [];
    
    // If repo has topics array (from sample projects), use those first
    if (repo.topics && Array.isArray(repo.topics)) {
        tags.push(...repo.topics.map(topic => 
            topic.charAt(0).toUpperCase() + topic.slice(1).replace('-', ' ')
        ));
    }
    
    if (repo.language) {
        tags.push(repo.language);
    }
    
    // Add additional tags based on repository name and description
    const content = `${repo.name} ${repo.description || ''}`.toLowerCase();
    
    if (content.includes('react')) tags.push('React');
    if (content.includes('vue')) tags.push('Vue.js');
    if (content.includes('angular')) tags.push('Angular');
    if (content.includes('node')) tags.push('Node.js');
    if (content.includes('express')) tags.push('Express');
    if (content.includes('mongodb')) tags.push('MongoDB');
    if (content.includes('mysql')) tags.push('MySQL');
    if (content.includes('api')) tags.push('API');
    if (content.includes('frontend')) tags.push('Frontend');
    if (content.includes('backend')) tags.push('Backend');
    if (content.includes('fullstack')) tags.push('Full Stack');

    return [...new Set(tags)].slice(0, 5); // Remove duplicates and limit to 5 tags
}

// Update skills section with personalized content
async function updateSkillsSection() {
    const skillsContainer = document.getElementById('skills-container');
    
    // Check if skills container exists (it was removed with Core Technologies section)
    if (!skillsContainer) {
        console.log('Skills container not found - section was removed');
        return;
    }
    
    // Personalized skills based on GitHub profile and interests
    const personalizedSkills = [
        { name: 'Full-Stack Development', icon: 'fas fa-layer-group', level: 'Expert' },
        { name: 'JavaScript/TypeScript', icon: 'fab fa-js-square', level: 'Advanced' },
        { name: 'React & Next.js', icon: 'fab fa-react', level: 'Advanced' },
        { name: 'Node.js & Express', icon: 'fab fa-node-js', level: 'Advanced' },
        { name: 'Python Development', icon: 'fab fa-python', level: 'Intermediate' },
        { name: 'Database Design', icon: 'fas fa-database', level: 'Advanced' },
        { name: 'Cloud Computing', icon: 'fas fa-cloud', level: 'Intermediate' },
        { name: 'DevOps & CI/CD', icon: 'fas fa-cogs', level: 'Intermediate' },
        { name: 'Mobile Development', icon: 'fas fa-mobile-alt', level: 'Beginner' },
        { name: 'UI/UX Design', icon: 'fas fa-paint-brush', level: 'Intermediate' },
        { name: 'API Development', icon: 'fas fa-plug', level: 'Advanced' },
        { name: 'Version Control (Git)', icon: 'fab fa-git-alt', level: 'Expert' }
    ];
    
    skillsContainer.innerHTML = personalizedSkills.map(skill => `
        <div class="skill-card" data-aos="fade-up">
            <div class="skill-icon">
                <i class="${skill.icon}"></i>
            </div>
            <h3 class="skill-name">${skill.name}</h3>
            <span class="skill-level">${skill.level}</span>
        </div>
    `).join('');
}

// Generate skills from repositories
function generateSkills(repos) {
    if (!skillsContainer) return;

    const languageStats = {};
    const skills = new Set();

    // Count languages and extract skills
    repos.forEach(repo => {
        if (repo.language) {
            languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
            skills.add(repo.language);
        }

        // Extract additional skills from repo names and descriptions
        const content = `${repo.name} ${repo.description || ''}`.toLowerCase();
        if (content.includes('react')) skills.add('React');
        if (content.includes('vue')) skills.add('Vue.js');
        if (content.includes('angular')) skills.add('Angular');
        if (content.includes('node')) skills.add('Node.js');
        if (content.includes('express')) skills.add('Express');
        if (content.includes('mongodb')) skills.add('MongoDB');
        if (content.includes('mysql')) skills.add('MySQL');
    });

    // Default skills if no repositories found
    if (skills.size === 0) {
        ['JavaScript', 'Python', 'HTML', 'CSS', 'React', 'Node.js'].forEach(skill => skills.add(skill));
    }

    const skillsArray = Array.from(skills).slice(0, 8); // Limit to 8 skills
    skillsContainer.innerHTML = '';

    skillsArray.forEach((skill, index) => {
        const skillCard = createSkillCard(skill, languageStats[skill] || 1);
        skillCard.classList.add('fade-in');
        skillCard.style.animationDelay = `${index * 0.1}s`;
        skillsContainer.appendChild(skillCard);
    });
}

// Create skill card
function createSkillCard(skill, count) {
    const card = document.createElement('div');
    card.className = 'skill-card';

    const icon = getSkillIcon(skill);
    const level = getSkillLevel(count);

    card.innerHTML = `
        <div class="skill-icon">${icon}</div>
        <h3 class="skill-name">${skill}</h3>
        <p class="skill-level">${level}</p>
    `;

    return card;
}

// Get skill icon
function getSkillIcon(skill) {
    const icons = {
        'JavaScript': '<i class="fab fa-js-square"></i>',
        'Python': '<i class="fab fa-python"></i>',
        'HTML': '<i class="fab fa-html5"></i>',
        'CSS': '<i class="fab fa-css3-alt"></i>',
        'React': '<i class="fab fa-react"></i>',
        'Vue.js': '<i class="fab fa-vuejs"></i>',
        'Angular': '<i class="fab fa-angular"></i>',
        'Node.js': '<i class="fab fa-node-js"></i>',
        'PHP': '<i class="fab fa-php"></i>',
        'Java': '<i class="fab fa-java"></i>',
        'C++': '<i class="fas fa-code"></i>',
        'C#': '<i class="fas fa-code"></i>',
        'Go': '<i class="fas fa-code"></i>',
        'Rust': '<i class="fas fa-code"></i>',
        'TypeScript': '<i class="fas fa-code"></i>',
        'Express': '<i class="fas fa-server"></i>',
        'MongoDB': '<i class="fas fa-database"></i>',
        'MySQL': '<i class="fas fa-database"></i>'
    };

    return icons[skill] || '<i class="fas fa-code"></i>';
}

// Get skill level based on usage count
function getSkillLevel(count) {
    if (count >= 5) return 'Expert';
    if (count >= 3) return 'Advanced';
    if (count >= 2) return 'Intermediate';
    return 'Beginner';
}

// Project filters
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Contact form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            // Simple form validation
            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }

            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                alert('Thank you for your message! I\'ll get back to you soon.');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Utility function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Add CSS for blinking cursor animation
const style = document.createElement('style');
style.textContent = `
    @keyframes blink {
        0%, 50% { border-color: transparent; }
        51%, 100% { border-color: white; }
    }
`;
document.head.appendChild(style);