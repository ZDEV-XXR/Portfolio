export function normalizeTechStack(techStack: unknown): string[] {
    if (Array.isArray(techStack)) {
        return techStack
            .filter((tech): tech is string => typeof tech === "string")
            .map((tech) => tech.trim())
            .filter(Boolean);
    }

    if (typeof techStack !== "string" || !techStack.trim()) {
        return [];
    }

    const value = techStack.trim().replace(/^\{\s*|\s*\}$/g, "");
    const technologies: string[] = [];
    let item = "";
    let quote: string | null = null;

    for (const character of value) {
        if ((character === '"' || character === "'") && (!quote || quote === character)) {
            quote = quote ? null : character;
        } else if (character === "," && !quote) {
            if (item.trim()) technologies.push(item.trim());
            item = "";
        } else {
            item += character;
        }
    }

    if (item.trim()) technologies.push(item.trim());

    return technologies;
}
