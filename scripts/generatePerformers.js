import dotenv from 'dotenv';
import { Performer } from '../src/models/index.js';

dotenv.config();

// Sample data pools for generating realistic performers
const firstNamesMale = ['James', 'Michael', 'David', 'John', 'Robert', 'William', 'Christopher', 'Daniel', 'Matthew', 'Anthony'];
const firstNamesFemale = ['Emma', 'Olivia', 'Sophia', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'Abigail'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const hairColors = ['Blonde', 'Brown', 'Black', 'Red', 'Auburn', 'Grey'];
const eyeColors = ['Blue', 'Brown', 'Green', 'Hazel', 'Grey'];
const skinTones = ['Fair', 'Light', 'Medium', 'Tan', 'Olive', 'Dark'];
const faceShapes = ['Oval', 'Round', 'Square', 'Heart', 'Diamond'];

// Generate random date of birth (between 18 and 65 years old)
function generateBirthday() {
    const today = new Date();
    const minAge = 18;
    const maxAge = 65;
    const age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
    const year = today.getFullYear() - age;
    const month = Math.floor(Math.random() * 12);
    const day = Math.floor(Math.random() * 28) + 1; // Use 28 to avoid invalid dates
    return new Date(year, month, day);
}

// Generate random phone number
function generatePhone() {
    const areaCode = Math.floor(Math.random() * 900) + 100;
    const firstPart = Math.floor(Math.random() * 900) + 100;
    const secondPart = Math.floor(Math.random() * 9000) + 1000;
    return `(${areaCode}) ${firstPart}-${secondPart}`;
}

// Generate random email
function generateEmail(firstName, lastName) {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
}

// Generate random height (in cm, between 150-200)
function generateHeight() {
    return Math.floor(Math.random() * 51) + 150; // 150-200 cm
}

// Generate distinctive marks
function generateDistinctiveMarks() {
    const marks = [
        'Small scar on left eyebrow',
        'Dimples',
        'Freckles',
        'Small tattoo on wrist',
        'Beauty mark on cheek',
        'None',
        'Pierced ears',
        'Mole on neck',
        'Natural highlights',
        'Distinctive smile'
    ];
    return marks[Math.floor(Math.random() * marks.length)];
}

// Get random element from array
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Generate sample performer images (using placeholder service)
function generateImages(gender, index) {
    // Using a placeholder image service with gender specification
    const genderParam = gender === 'Male' ? 'men' : 'women';
    const images = [];
    for (let i = 0; i < 9; i++) {
        // Using a combination of index and i to get different images for each performer
        const imageNumber = (index * 10 + i) % 100;
        images.push(`https://randomuser.me/api/portraits/${genderParam}/${imageNumber}.jpg`);
    }
    return images;
}

async function generatePerformers() {
    try {
        console.log('🎬 Starting to generate 10 random performers...\n');

        const performers = [];

        for (let i = 0; i < 10; i++) {
            const gender = Math.random() > 0.5 ? 'Male' : 'Female';
            const firstName = gender === 'Male'
                ? getRandomElement(firstNamesMale)
                : getRandomElement(firstNamesFemale);
            const lastName = getRandomElement(lastNames);

            const performerData = {
                firstName,
                lastName,
                birthday: generateBirthday(),
                email: generateEmail(firstName, lastName),
                phone: generatePhone(),
                gender,
                height: generateHeight(),
                hairColor: getRandomElement(hairColors),
                eyeColor: getRandomElement(eyeColors),
                skinTone: getRandomElement(skinTones),
                faceShape: getRandomElement(faceShapes),
                distinctiveMarks: generateDistinctiveMarks(),
                // images: generateImages(gender, i),
                profileImageIndex: 0
            };

            const performer = await Performer.create(performerData);
            performers.push(performer);

            console.log(`✅ Created: ${performer.firstName} ${performer.lastName} (${performer.gender}, ${performer.height}cm)`);
        }

        console.log('\n🎉 Successfully generated 10 performers!');
        console.log('\n📊 Summary:');
        const maleCount = performers.filter(p => p.gender === 'Male').length;
        const femaleCount = performers.filter(p => p.gender === 'Female').length;
        console.log(`   - Male: ${maleCount}`);
        console.log(`   - Female: ${femaleCount}`);
        console.log(`   - Total: ${performers.length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error generating performers:', error);
        process.exit(1);
    }
}

// Run the script
generatePerformers();
