'use client';
import { Unit } from './LessonList';

type Props = {
    initialUnits: Unit[];
    unit: string;
    setUnit: (v: string) => void;
    grade: string;
    setGrade: (v: string) => void;
    curriculum: string;
    setCurriculum: (v: string) => void;
    activity: string;
    setActivity: (v: string) => void;
    support: string;
    setSupport: (v: string) => void;
    colorClass?: string;
};


export default function LessonSidebar({
    initialUnits,
    unit,
    setUnit,
    grade,
    setGrade,
    curriculum,
    setCurriculum,
    activity,
    setActivity,
    support,
    setSupport,
    colorClass,
}: Props) {

    return (
        <aside className="space-y-8 md:col-span-2 pt-2 mr-30">
            {/* Unit Tabs */}
            <div className="mb-6">
                <h4 className="font-bold text-xs mb-3 tracking-widest text-green-active">
                    ALL UNITS
                </h4>
                <ul>
                    {initialUnits.map((u) => {
                        const isSelected = unit === u.id;

                        const colorStyle = {
                            color: isSelected ? colorClass : '#8E8E8E',
                            borderBottom: isSelected ? `3px solid ${colorClass}` : '3px solid transparent',
                        };

                        return (
                            <li key={u.id}>
                                <button
                                    onClick={() => setUnit(unit === u.id ? '' : u.id)}
                                    className="block w-full text-left py-2 transition font-semibold"
                                    style={colorStyle}
                                >
                                    {u.title}
                                </button>

                            </li>
                        );
                    })}
                </ul>

            </div>

            <div className="space-y-3 pt-4 border-t border-[#EFE9E9]">
                <h2 className="text-sm font-semibold text-[#363F36]">FILTERS</h2>

                <div>
                    <label className="block text-xs text-[#8E8E8E] mb-1">Grade</label>
                    <select
                        className="w-full border rounded px-2 py-1 text-sm text-[#363F36] bg-[#EFE9E9]"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                    >
                        <option value="">All Grades</option>
                        <option value="9">9th</option>
                        <option value="10">10th</option>
                        <option value="11">11th</option>
                        <option value="12">12th</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs text-[#8E8E8E] mb-1">Curriculum</label>
                    <select
                        className="w-full border rounded px-2 py-1 text-sm text-[#363F36] bg-[#EFE9E9]"
                        value={curriculum}
                        onChange={(e) => setCurriculum(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="IB">IB</option>
                        <option value="AP">AP</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs text-[#8E8E8E] mb-1">Learning Activities</label>
                    <select
                        className="w-full border rounded px-2 py-1 text-sm text-[#363F36] bg-[#EFE9E9]"
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="case-study">Case Study</option>
                        <option value="debate">Debate</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs text-[#8E8E8E] mb-1">Supports</label>
                    <select
                        className="w-full border rounded px-2 py-1 text-sm text-[#363F36] bg-[#EFE9E9]"
                        value={support}
                        onChange={(e) => setSupport(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="scaffolded">Scaffolded</option>
                    </select>
                </div>
            </div>
        </aside>
    );
}
