import React from 'react';
import { cn } from '../../lib/utils';

export const Card = ({ children, className = "", hover = false, ...props }) => {
    return (
        <div
            className={cn(
                "bg-evio-white text-evio-black rounded-2xl shadow-evio-card p-6 border border-evio-border transition-transform duration-300",
                hover ? "hover:-translate-y-2" : "",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
