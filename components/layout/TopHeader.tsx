import React from "react";

export function TopHeader({ leftContent, rightContent }: { leftContent?: React.ReactNode, rightContent?: React.ReactNode }) {
    return (
        <>
            <div className="flex items-center gap-4">
                {leftContent}
            </div>
            <div className="flex items-center gap-4">
                {rightContent}
            </div>
        </>
    );
}
