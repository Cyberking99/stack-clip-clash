import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, View } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    className?: string;
    textClassName?: string;
    icon?: React.ReactNode;
}

export function Button({
    title,
    variant = 'primary',
    className = '',
    textClassName = '',
    icon,
    ...props
}: ButtonProps) {
    let buttonClasses = 'flex-row items-center justify-center px-6 py-3 rounded-xl h-14 transition-all active:opacity-80';
    let textClasses = 'font-bold text-lg';

    switch (variant) {
        case 'secondary':
            buttonClasses += ' bg-secondary shadow-lg shadow-secondary/20';
            textClasses += ' text-white';
            break;
        case 'outline':
            buttonClasses += ' bg-transparent border border-surface';
            textClasses += ' text-text';
            break;
        case 'ghost':
            buttonClasses += ' bg-transparent';
            textClasses += ' text-muted';
            break;
        default: // primary
            buttonClasses += ' bg-primary shadow-lg shadow-primary/20';
            textClasses += ' text-white';
    }

    return (
        <TouchableOpacity className={`${buttonClasses} ${className}`} activeOpacity={0.7} {...props}>
            {icon && <View className="mr-2">{icon}</View>}
            <Text className={`${textClasses} ${textClassName}`}>{title}</Text>
        </TouchableOpacity>
    );
}
