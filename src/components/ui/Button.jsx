import React from 'react';
import { cn } from '../../lib/utils';

export const Button = ({ children, variant = "primary", className = "", ...props }) => {
    const baseStyles = "inline-flex items-center justify-center font-inter font-medium transition-all duration-300 rounded-lg px-6 h-12";

    const variants = {
        primary: "bg-evio-blue text-evio-white hover:bg-evio-navy hover:shadow-lg",
        secondary: "bg-transparent border-2 border-evio-blue text-evio-blue hover:bg-evio-blue hover:text-white",
        ghost: "bg-transparent border border-evio-white text-evio-white hover:bg-evio-blue hover:border-evio-blue",
    };

    return (
        <button className={cn(baseStyles, variants[variant], className)} {...props}>
            {children}
        </button>
    );
};
