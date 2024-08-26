export default function MovieSkeleton() {

    return (
        <div className="skeletonCard flex w-56  flex-col gap-4">
            <div className="skeleton h-72 w-full"></div>
            <div className="h-1 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="h-1 w-full"></div>
            <div className="skeleton h-4 w-36 self-center"></div>
            <div className="h-1 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
        </div>
    )
}