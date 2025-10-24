import anthropic from '../config/aiClient.js';

export const generateEmail = async (performer, commercialDescription, companyName) => {
    try {
        const prompt = `
You are a professional casting director assistant. Generate a personalized email to a performer about a casting opportunity.

Performer Details:
- Name: ${performer.firstName} ${performer.lastName}
- Gender: ${performer.gender}
- Age: ${calculateAge(performer.birthday)} years old

Commercial Details:
- Company: ${companyName}
- Description: ${commercialDescription}

Write a professional, warm email inviting the performer to participate in this commercial casting.
The email should:
1. Be personalized with the performer's name
2. Mention why they might be a good fit based on the commercial description
3. Be encouraging and professional
4. Include next steps or contact information placeholder

Return only the email body content (without subject line or greeting/closing formalities - those will be added by the template).
`;

        const message = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 500,
            temperature: 0.7,
            system: "You are a professional casting director assistant who writes personalized, encouraging emails to performers.",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        return message.content[0].text.trim();
    } catch (error) {
        console.error('[AI] Error generating email:', error);
        throw new Error('Failed to generate email content');
    }
};

const calculateAge = (birthday) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};

export default { generateEmail };
