export function Logo(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={props.className}
            {...props}
        >
            {/* Outer V shape */}
            <path d="M3 4L12 21L21 4" stroke="hsl(var(--primary))" strokeWidth="2.5" className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            {/* Inner circuit lines */}
            <path d="M7.5 4L12 12.5L16.5 4" stroke="hsl(var(--primary))" strokeOpacity="0.5" strokeWidth="1.5" />
            <circle cx="12" cy="21" r="1" fill="hsl(var(--primary))" className="animate-pulse" />
            <circle cx="3" cy="4" r="1" fill="hsl(var(--primary))" />
            <circle cx="21" cy="4" r="1" fill="hsl(var(--primary))" />
        </svg>
    )
}
