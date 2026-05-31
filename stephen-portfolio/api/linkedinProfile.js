/**
 * Stephen Agyemang's LinkedIn Profile Data
 *
 * Curated from public LinkedIn profile: linkedin.com/in/stephagyemang
 * Last updated: May 2026
 */

export function getLinkedInProfile() {
    return {
        profileUrl: "https://www.linkedin.com/in/stephagyemang",
        headline: "Incoming DL/ML Researcher & ITAP Intern @ DePauw University | Honor Scholar | CodePath Graduate | Aspiring Software Engineer | Harvard ALP '25 Alumni | ColorStack Fellow",
        location: "Greater Indianapolis",
        stats: "1K+ followers · 500+ connections",
        summary: `Computer Science student at DePauw University, focused on building scalable software and exploring the intersections of AI and machine learning. Tech and Design Lead for the Google Developer Group on campus, where I help drive innovation and collaborative projects. Aspire Leaders Program alumnus (Harvard, Cohort 4 '25) and ColorStack Fellow. Core strengths: public speaking, adaptability, and team leadership. Beyond code, I'm a multi-disciplinary thinker — blending logic with theatre, music, photography, and soccer.`,

        workExperience: [
            {
                title: "IT Intern",
                company: "DePauw University",
                type: "Part-time · On-site",
                location: "Greencastle, Indiana",
                dates: "March 2026 – Present",
                description: "Provide technical support to students, faculty, and staff by diagnosing and resolving hardware, software, and basic network issues. Manage and document support requests through the university ticketing system, ensuring accurate tracking and timely resolution. Assist with device setup, password resets, multi-factor authentication, and software installations."
            },
            {
                title: "STEM Guide",
                company: "DePauw University",
                type: "Part-time · On-site",
                location: "Greencastle, Indiana",
                dates: "January 2026 – Present",
                description: "Assist students in understanding introductory programming concepts during class sessions. Provide outside-of-class support to clarify coursework and debug code. Help students grasp the fundamentals of Java and computer science, fostering a supportive learning environment."
            },
            {
                title: "Overnight Host",
                company: "DePauw University",
                type: "Part-time · On-site",
                location: "Greencastle, Indiana",
                dates: "January 2026 – Present",
                description: "Serve as a student ambassador for prospective students during overnight campus visits. Introduce guests to both the academic and social life at DePauw, ensuring their safety, comfort, and honest answers to their questions."
            },
        ],

        education: [
            {
                school: "DePauw University",
                degree: "Bachelor of Arts (BA) in Computer Science",
                dates: "January 2025 – December 2028 (Expected)",
                gpa: "4.0 / 4.0",
                honors: ["Honor Scholar — DePauw's most prestigious academic track, selected through a competitive writing and interview process based on academic excellence and interdisciplinary thinking."],
                activities: [
                    "Google Developers Group on Campus (Design Lead)",
                    "DePauw International Student Association (former Student Leader)",
                    "African Students Association (former Student Leader)",
                    "DePauw Futbol Club",
                    "DePauw WiCS"
                ],
                relevantCoursework: [
                    "Computer Science I (CSC-121B)",
                    "Data Structures (CSC-235A)",
                    "Principles of Software Development (CSC-125A)",
                    "Computational Discrete Math (MATH-123A)",
                    "Calculus I (MATH-151B)",
                    "Acting I & II",
                    "Voice and Movement",
                    "Photography & Social Justice",
                    "Beginning Class Folk Guitar I",
                    "Beginning Class Piano",
                ],
            },
            {
                school: "Aspire Institute (Harvard Aspire Leaders Program)",
                degree: "Urban Education and Leadership — Alumni",
                dates: "August 2025 – October 2025",
                gpa: "Alumni (Cohort 4, 2025)",
                honors: [],
                relevantCoursework: [],
                description: "Global leadership development initiative for limited-income and first-generation university students. Multi-module curriculum covering personal growth, leadership, and community impact through live sessions and mentorship."
            },
        ],

        skills: [
            "Python", "Java", "C++", "JavaScript", "React", "FastAPI",
            "Gemini AI", "Generative AI", "Node.js", "HTML/CSS",
            "Git", "GitHub", "Docker", "REST APIs",
            "Software Development", "Data Structures", "Machine Learning",
            "Web Development", "Database Management", "Problem-Solving",
            "Public Speaking", "Team Leadership", "Mentoring", "Adaptability",
            "Community Building", "Usability Testing",
        ],

        certifications: [
            {
                name: "CodePath TIP101",
                issuer: "CodePath",
                date: "May 2026",
                credentialId: "395732",
                skills: ["Python", "Problem Solving", "Data Structures", "Algorithms"]
            },
            {
                name: "Certificate of Completion | AscentUP Professional Skills Fundamentals",
                issuer: "Ascent",
                date: "January 2025",
                skills: ["Teamwork", "Problem Solving"]
            },
            {
                name: "Aspire Leaders Program Fellow — Alumni (Cohort 4, 2025)",
                issuer: "Aspire Institute",
                date: "October 2025",
            },
        ],

        honorsAndAwards: [
            {
                title: "Honor Scholar",
                issuer: "DePauw University Honor Scholar Program",
                date: "January 2026",
                description: "Selected for DePauw's most prestigious academic track based on academic excellence, intellectual curiosity, and interdisciplinary thinking — awarded through a selective writing and interview process."
            },
            {
                title: "Distinguish Scholarship",
                issuer: "DePauw University",
                date: "July 2024",
            },
            {
                title: "Emerging Leader Award",
                issuer: "DePauw University",
                date: "July 2024",
            },

        ],

        organizations: [
            {
                name: "Google Developer Student Clubs (GDG on Campus – DePauw)",
                role: "Tech and Design Lead",
                dates: "September 2025 – Present",
                location: "Greencastle, Indiana",
                description: "Lead the technical and design direction for the GDG chapter at DePauw. Organized and participated in the GDG Coding Jam — FridgeJam was the first project ever featured at the inaugural session and was recognized by GDG leadership."
            },
            {
                name: "ColorStack",
                role: "Student Fellow",
                dates: "June 2025 – Present",
                location: "United States (Remote)",
                description: "Member of ColorStack, a CS community for Black and LatinX students offering career prep, coding workshops, and mentorship for navigating careers in tech."
            },
        ],

        volunteerAndLeadership: [
            {
                role: "Welcome Week Student Volunteer",
                organization: "DePauw University",
                dates: "August 2025",
                description: "Assisted incoming students during Welcome Week with campus navigation, move-in logistics, and orientation onboarding."
            },
            {
                role: "Software Testing Volunteer",
                organization: "DePauw University",
                dates: "November 2025",
                description: "Contributed usability feedback on a DePauw software testing project, helping enhance the overall student digital experience."
            },
        ],

        languages: [
            { language: "English", proficiency: "Native or bilingual proficiency" },
            { language: "French", proficiency: "Elementary proficiency" },
        ],

        recentActivity: [
            "FridgeJam was featured by GDG Developer Relations Engineering Manager Christina Lin as the first project at the inaugural GDG Coding Jam — praised for its gamified UX and mini-games while waiting for LLM output.",
            "Reposted a recap of Google I/O 2026, highlighting AI sandbox experiences with Gemini, Workspace, and developer community building.",
        ],
    };
}