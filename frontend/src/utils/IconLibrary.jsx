import * as solidIcons from '@fortawesome/free-solid-svg-icons';

export const iconMap = Object.fromEntries(
    Object.entries(solidIcons)
        .filter(([key]) => key.startsWith('fa'))
        .map(([key, icon]) => [key.replace('fa', '').toLowerCase(), icon])
);
