export default function Divider() {
    return (
        <div className="flex w-full items-center justify-center my-10">
            <svg
                width="100%"
                height="32"
                viewBox="0 0 400 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="min-w-[80px]"
            >
                {/* Left line */}
                <line
                    x1="-2000"
                    y1="16"
                    x2="185"
                    y2="16"
                    stroke="#DED6D6"
                    strokeWidth="2"
                />
                {/* Right line */}
                <line
                    x1="0"
                    y1="16"
                    x2="2000"
                    y2="16"
                    stroke="#DED6D6"
                    strokeWidth="2"
                />
                {/* Plus vertical */}
                <rect x="199" y="7" width="2.5" height="18" rx="0" fill="#3E724A" />
                {/* Plus horizontal */}
                <rect x="187" y="15" width="26" height="2" rx="0" fill="#3E724A" />
            </svg>
        </div>
    );
}
