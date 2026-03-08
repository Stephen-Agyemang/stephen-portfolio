/**
 * Stephen Agyemang's LinkedIn Profile Data
 * 
 * Curated from public LinkedIn profile: linkedin.com/in/stephagyemang
 * Last updated: March 2026
 */

export function getLinkedInProfile() {
    return {
        profileUrl: "https://www.linkedin.com/in/stephagyemang",
        headline: "Computer Science Student at DePauw University",
        location: "Greater Indianapolis",
        stats: "1K+ followers, 500+ connections",
        summary: `As a Computer Science student at DePauw University, I am dedicated to honing my skills in software development, data analysis, and problem-solving. I have a strong foundation in Java, Python, and C++ and have gained practical experience through projects involving web development, database management, and machine learning.`,

        workExperience: [
            {
                title: "IT Intern",
                company: "DePauw University",
                type: "On-campus",
                location: "Greencastle, IN",
                dates: "March 2026 – Present",
            },
            {
                title: "STEM Guide",
                company: "DePauw University",
                type: "On-campus",
                location: "Greencastle, IN",
                dates: "January 2026 – Present",
            },
            {
                title: "Overnight Host",
                company: "DePauw University",
                type: "On-campus",
                location: "Greencastle, IN",
                dates: "March 2026",
                description: "Served as a personal student ambassador for a prospective student during overnight campus visits and introduced them to both the social and academic aspects of DePauw University."
            },
        ],

        education: [
            {
                school: "DePauw University",
                degree: "Bachelor of Arts (BA) in Computer Science",
                dates: "2025 – 2028 (Expected)",
                gpa: "3.95 cumulative (4.0 current semester)",
                honors: ["Honor Scholar"],
                relevantCoursework: [
                    "Computer Science I (CSC-121B)",
                    "Data Structures (CSC-235A)",
                    "Principles of Software Development (CSC-125A)",
                    "Computational Discrete Math (MATH-123A)",
                    "Calculus I (MATH-151B)",
                    "Intro to Economics (ECON-100A)",
                    "Engaged Leadership (LEAD-EXPA)",
                    "Inclusive Excellence Practice (UNIV-316A)",
                    "Acting I & II",
                    "Beginning Class Folk Guitar I",
                    "Beginning Class Piano",
                    "Photography & Social Justice",
                    "Voice and Movement",
                ],
            },
        ],

        skills: [
            "Java",
            "Python",
            "C++",
            "JavaScript",
            "React",
            "Node.js",
            "Git",
            "GitHub",
            "Software Development",
            "Data Analysis",
            "Machine Learning",
            "Web Development",
            "Database Management",
            "Usability Testing",
            "Problem-Solving",
            "HTML/CSS",
        ],

        certifications: [
            {
                name: "Aspire Leaders Program Fellow — Alumni (Cohort 4, 2025)",
                issuer: "Aspire Institute",
                date: "October 2025",
            },
            {
                name: "Certificate of Completion | AscentUP Professional Skills Fundamentals",
                issuer: "Ascent",
                date: "January 2025",
            },
        ],

        volunteerAndLeadership: [
            {
                role: "Student Volunteer",
                organization: "DePauw University Software Testing Project",
                dates: "November 2025",
                description: "Participated in software testing and usability feedback projects."
            },
            {
                role: "Welcome Week Assistant",
                organization: "DePauw University",
                location: "Greencastle, IN",
                dates: "August 2025",
                description: "Assisted incoming students during DePauw University's Welcome Week orientation."
            },
        ],

        recentActivity: [
            // Update this whenever Stephen posts something notable on LinkedIn
        ],
    };
}
