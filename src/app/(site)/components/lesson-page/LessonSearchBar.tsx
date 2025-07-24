type Props = {
    search: string;
    setSearch: (v: string) => void;
};

export default function LessonSearchBar({ search, setSearch }: Props) {
    return (
        <div className="mb-8 px-4 md:px-25">
            <input
                type="text"
                placeholder="Search Lessons"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 rounded border border-gray-300  text-[#363F36] placeholder-[#888] focus:outline-none"
            />
        </div>
    );
}
