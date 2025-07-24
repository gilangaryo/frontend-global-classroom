import CheckIcon from "../CheckIcon";
import CardButton from "../CardButton";
export default function OfferSection() {
    const teacherList = [
        "Complete courses with 4–5 thematic units and end-of-unit assessments",
        "25 + lessons featuring 4-7 learning activities",
        "Anchored in detailed, recent and real-world case studies",
        "Fully editable Google Docs and Canva Presentations",
        "Focus on global issues: justice, conflict, development, rights",
        "Tools to build critical thinking, global understanding, and academic writing",
    ];
    const classroomList = [
        "Curriculum & toolkit development for NGOs, schools, and networks",
        "Multimedia storytelling rooted in local perspectives and lived experience",
        "Field study design & facilitation with community-based partners",
        "Educator training in justice-centered, experiential pedagogy",

    ];

    return (
        <section id="offer" className="py-16 px-15 bg-alt2">
            <div className="max-w-full mx-auto">

                <h2 className="text-8xl font-bold text-primary text-center mb-16">What We Offer</h2>
                <div className="grid md:grid-cols-2 gap-8">


                    <div className="
                            bg-white 
                            p-6 
                            rounded-lg 
                            shadow 
                            flex flex-col justify-between 
                            border-2 border-primary
                            group 
                            transition-colors 
                            duration-200
                            hover:bg-primary 
                            hover:text-alt 
                            hover:border-transparent
                        ">
                        <div>
                            <h3 className="
                                    text-2xl font-semibold text-secondary mb-4 
                                    group-hover:text-alt transition-colors duration-200
                                ">
                                FOR TEACHERS
                            </h3>
                            <p className="mb-4">Engaging, ready-to-use lessons for Social Studies, Global Politics and Human Rights</p>
                            {teacherList.map((text, i) => (
                                <li key={i} className="flex items-start gap-2 my-4">
                                    <CheckIcon className="flex-shrink-0 mt-1 group-hover:text-alt text-primary transition-colors duration-200" />
                                    <span>{text}</span>
                                </li>
                            ))}
                        </div>
                        <div className="mt-8 flex items-center justify-center gap-4 w-full">
                            <button className="
                                    w-full px-6 py-2 rounded 
                                    bg-primary text-white 
                                    group-hover:bg-alt group-hover:text-primary 
                                    transition-colors duration-200 font-semibold
                                ">
                                Explore Lessons
                            </button>
                            <button className="
                                    w-full px-6 py-2 rounded border-2 
                                    bg-white text-primary border-primary
                                    group-hover:bg-primary group-hover:text-alt group-hover:border-alt
                                    transition-colors duration-200 font-semibold
                                ">
                                Explore Courses
                            </button>
                        </div>
                    </div>

                    <div className="
  bg-white p-6 rounded-lg shadow flex flex-col justify-between border-2 border-primary
  group transition-colors duration-200
  hover:bg-primary hover:text-alt hover:border-transparent
">
                        <div>
                            <h3 className="text-2xl font-semibold text-secondary mb-4 group-hover:text-alt transition-colors duration-200">
                                Beyond the Classroom
                            </h3>
                            <p className="mb-4">Custom learning experiences that connect students and educators with frontline communities and global justice work</p>
                            <ul className="list-disc list-inside space-y-2 mb-4 text-text">
                                {classroomList.map((text, i) => (
                                    <li key={i} className="flex items-start gap-2 my-4">
                                        <CheckIcon className="flex-shrink-0 mt-1 group-hover:text-alt text-primary transition-colors duration-200" />
                                        <span>{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-auto flex items-center justify-center gap-4 w-full">
                            <CardButton variant="primary">Learn More</CardButton>
                        </div>
                    </div>


                </div>
            </div>
        </section >
    );
}
