import React from 'react';
import { Text, TextProps } from 'react-native';

interface TypographyProps extends TextProps {
    variant?: 'h1' | 'h2' | 'body' | 'muted' | 'label';
    className?: string;
}

export function Typography({
    variant = 'body',
    className = '',
    children,
    ...props
}: TypographyProps) {
    let defaultClasses = '';

    switch (variant) {
        case 'h1':
            defaultClasses = 'text-4xl font-heading font-bold text-text';
            break;
        case 'h2':
            defaultClasses = 'text-2xl font-heading font-bold text-text';
            break;
        case 'muted':
            defaultClasses = 'text-sm font-sans text-muted';
            break;
        case 'label':
            defaultClasses = 'text-xs font-sans font-bold text-muted uppercase tracking-wider';
            break;
        default:
            defaultClasses = 'text-base font-sans text-text';
    }

    return (
        <Text className={`${defaultClasses} ${className}`} {...props}>
            {children}
        </Text>
    );
}
