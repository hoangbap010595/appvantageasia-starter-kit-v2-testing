export interface StoryContentFillerProps {
    height?: number | string;
    width?: number | string;
}

const StoryContentFiller = ({ height = '50vh', width }: StoryContentFillerProps) => (
    <div
        className="relative h-96 w-full overflow-hidden rounded-xl border border-dashed border-gray-400 opacity-75"
        style={{ height, width }}
    >
        <svg className="absolute inset-0 h-full w-full stroke-gray-900/10" fill="none">
            <defs>
                <pattern
                    height="10"
                    id="pattern-87beeb02-b726-4cd1-be69-ae5bc27986e9"
                    patternUnits="userSpaceOnUse"
                    width="10"
                    x="0"
                    y="0"
                >
                    <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3" />
                </pattern>
            </defs>
            <rect fill="url(#pattern-87beeb02-b726-4cd1-be69-ae5bc27986e9)" height="100%" stroke="none" width="100%" />
        </svg>
    </div>
);

export default StoryContentFiller;
