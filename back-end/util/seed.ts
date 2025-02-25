import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
    // Delete data in the reverse order of dependency to avoid conflicts
    await prisma.review.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.productCatalog.deleteMany();
    await prisma.product.deleteMany();
    await prisma.shoppingCart.deleteMany();
    await prisma.order.deleteMany();
    await prisma.user.deleteMany();
    await prisma.address.deleteMany();

    // Create Address
    const addressJhon = await prisma.address.create({
        data: {
            street: 'Bondgenotenlaan',
            houseNumber: '1',
            city: 'Leuven',
            state: 'Vlaams Brabant',
            postalCode: '3000',
            country: 'Belgium',
        },
    });

    const addressJane = await prisma.address.create({
        data: {
            street: 'Maria Theresistraat',
            houseNumber: '20',
            city: 'Leuven',
            state: 'Vlaams Brabant',
            postalCode: '30000',
            country: 'Belgium',
        },
    });

    const addressMike = await prisma.address.create({
        data: {
            street: 'Naamsestraat',
            houseNumber: '45',
            city: 'Leuven',
            state: 'Vlaams Brabant',
            postalCode: '3000',
            country: 'Belgium',
        },
    });

    const addressEmily = await prisma.address.create({
        data: {
            street: 'Parkstraat',
            houseNumber: '12A',
            city: 'Brussels',
            state: 'Brussels Capital',
            postalCode: '1000',
            country: 'Belgium',
        },
    });

    const addressChris = await prisma.address.create({
        data: {
            street: 'Diestsestraat',
            houseNumber: '58B',
            city: 'Leuven',
            state: 'Vlaams Brabant',
            postalCode: '3000',
            country: 'Belgium',
        },
    });

    const passwordJhon = await bcrypt.hash('JhonsSuperSecretPassword', 12);

    const John = await prisma.user.create({
        data: {
            name: 'Jhon Doe',
            phoneNumber: '+32 123 45 67 89',
            emailAddress: 'Jhon.owner@userbazaar.com',
            password: passwordJhon,
            seller: true,
            newsLetter: true,
            role: 'Owner',
            address: {
                connect: { id: addressJhon.id },
            },
        },
    });

    const passwordJane = await bcrypt.hash('Something_secure', 12);

    const Jane = await prisma.user.create({
        data: {
            name: 'Jane Toe',
            phoneNumber: '+32 400 85 96 91',
            emailAddress: 'Jane.Toe@gmail.com',
            password: passwordJane,
            seller: true,
            newsLetter: true,
            role: 'User',
            address: {
                connect: { id: addressJane.id },
            },
        },
    });

    const passwordMike = await bcrypt.hash('SecurePassword123', 12);

    const Mike = await prisma.user.create({
        data: {
            name: 'Mike Smith',
            phoneNumber: '+32 234 56 78 90',
            emailAddress: 'mike.smith@domain.com',
            password: passwordMike,
            seller: false,
            newsLetter: false,
            role: 'User',
            address: {
                connect: { id: addressMike.id },
            },
        },
    });

    const passwordEmily = await bcrypt.hash('SuperSecretPassword', 12);

    const Emily = await prisma.user.create({
        data: {
            name: 'Emily White',
            phoneNumber: '+32 499 22 33 44',
            emailAddress: 'Emily.admin@userbazaar.com',
            password: passwordEmily,
            seller: true,
            newsLetter: false,
            role: 'Admin',
            address: {
                connect: { id: addressEmily.id },
            },
        },
    });

    const users = [
        {
            name: 'Alice Johnson',
            phoneNumber: '+32 123 45 67 90',
            emailAddress: 'alice.johnson@domain.com',
            password: 'PasswordAlice123',
            seller: false,
            newsLetter: true,
            role: 'User',
            address: {
                street: 'Main Street',
                houseNumber: '10',
                city: 'Antwerp',
                state: 'Antwerp',
                postalCode: '2000',
                country: 'Belgium',
            },
        },
        {
            name: 'Bob Williams',
            phoneNumber: '+32 234 56 78 91',
            emailAddress: 'bob.williams@domain.com',
            password: 'PasswordBob123',
            seller: true,
            newsLetter: false,
            role: 'User',
            address: {
                street: 'High Street',
                houseNumber: '20',
                city: 'Ghent',
                state: 'East Flanders',
                postalCode: '9000',
                country: 'Belgium',
            },
        },
        {
            name: 'Charlie Davis',
            phoneNumber: '+32 345 67 89 12',
            emailAddress: 'charlie.davis@domain.com',
            password: 'PasswordCharlie123',
            seller: false,
            newsLetter: true,
            role: 'User',
            address: {
                street: 'Market Street',
                houseNumber: '30',
                city: 'Bruges',
                state: 'West Flanders',
                postalCode: '8000',
                country: 'Belgium',
            },
        },
        {
            name: 'Diana Evans',
            phoneNumber: '+32 456 78 91 23',
            emailAddress: 'diana.evans@domain.com',
            password: 'PasswordDiana123',
            seller: true,
            newsLetter: false,
            role: 'User',
            address: {
                street: 'Church Street',
                houseNumber: '40',
                city: 'Hasselt',
                state: 'Limburg',
                postalCode: '3500',
                country: 'Belgium',
            },
        },
        {
            name: 'Ethan Harris',
            phoneNumber: '+32 567 89 12 34',
            emailAddress: 'ethan.harris@domain.com',
            password: 'PasswordEthan123',
            seller: false,
            newsLetter: true,
            role: 'User',
            address: {
                street: 'King Street',
                houseNumber: '50',
                city: 'Mechelen',
                state: 'Antwerp',
                postalCode: '2800',
                country: 'Belgium',
            },
        },
        {
            name: 'Fiona Green',
            phoneNumber: '+32 678 91 23 45',
            emailAddress: 'fiona.green@domain.com',
            password: 'PasswordFiona123',
            seller: true,
            newsLetter: false,
            role: 'User',
            address: {
                street: 'Queen Street',
                houseNumber: '60',
                city: 'Leuven',
                state: 'Flemish Brabant',
                postalCode: '3000',
                country: 'Belgium',
            },
        },
        {
            name: 'George Hall',
            phoneNumber: '+32 789 12 34 56',
            emailAddress: 'george.hall@domain.com',
            password: 'PasswordGeorge123',
            seller: false,
            newsLetter: true,
            role: 'User',
            address: {
                street: 'Prince Street',
                houseNumber: '70',
                city: 'Namur',
                state: 'Namur',
                postalCode: '5000',
                country: 'Belgium',
            },
        },
        {
            name: 'Hannah King',
            phoneNumber: '+32 891 23 45 67',
            emailAddress: 'hannah.king@domain.com',
            password: 'PasswordHannah123',
            seller: true,
            newsLetter: false,
            role: 'User',
            address: {
                street: 'Duke Street',
                houseNumber: '80',
                city: 'Mons',
                state: 'Hainaut',
                postalCode: '7000',
                country: 'Belgium',
            },
        },
    ];

    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 12);
        const address = await prisma.address.create({
            data: {
                street: user.address.street,
                houseNumber: user.address.houseNumber,
                city: user.address.city,
                state: user.address.state,
                postalCode: user.address.postalCode,
                country: user.address.country,
            },
        });

        await prisma.user.create({
            data: {
                name: user.name,
                phoneNumber: user.phoneNumber,
                emailAddress: user.emailAddress,
                password: hashedPassword,
                seller: user.seller,
                newsLetter: user.newsLetter,
                role: user.role,
                address: {
                    connect: { id: address.id },
                },
            },
        });
    }

    const passwordChris = await bcrypt.hash('AnotherSecurePassword', 10);

    const Chris = await prisma.user.create({
        data: {
            name: 'Chris Brown',
            phoneNumber: '+32 488 77 66 55',
            emailAddress: 'Chris.Brown@gmail.com',
            password: passwordChris,
            seller: false,
            newsLetter: true,
            role: 'User',
            address: {
                connect: { id: addressChris.id },
            },
        },
    });

    // Create Products
    const products = [
        {
            name: 'JBL Headphones',
            description: 'Noise-cancelling over-ear headphones',
            media: '/productPictures/jbl.jpeg',
            stock: 50,
            price: 199,
            details: 'Wireless, 20 hours battery life',
        },
        {
            name: 'Apple iPhone 13',
            description: 'Latest model of the iPhone series',
            media: '/productPictures/iphone.jpg',
            stock: 30,
            price: 999,
            details: '128GB, Black',
        },
        {
            name: 'Samsung Galaxy S21',
            description: 'Flagship smartphone from Samsung',
            media: '/productPictures/samsung21.jpg',
            stock: 40,
            price: 799,
            details: '256GB, Silver',
        },
        {
            name: 'Sony WH-1000XM4',
            description: 'Industry-leading noise canceling with Dual Noise Sensor technology',
            media: '/productPictures/SonyWH.png',
            stock: 25,
            price: 349,
            details: '30 hours battery life, touch sensor controls',
        },
        {
            name: 'Dell XPS 13',
            description: 'High-performance laptop with InfinityEdge display',
            media: '/productPictures/Dell_XPS_13.png',
            stock: 15,
            price: 1199,
            details: '13.4-inch FHD+, Intel Core i7, 16GB RAM, 512GB SSD',
        },
        {
            name: 'Google Pixel 6',
            description: "Google's latest smartphone with advanced AI features",
            media: '/productPictures/Pixel6.png',
            stock: 35,
            price: 699,
            details: '128GB, Stormy Black',
        },
        {
            name: 'Amazon Echo Dot',
            description: 'Smart speaker with Alexa',
            media: '/productPictures/echo.png',
            stock: 100,
            price: 49,
            details: '4th Gen, Charcoal',
        },
        {
            name: 'Apple MacBook Pro',
            description: 'Powerful laptop with M1 chip',
            media: '/productPictures/macbook.png',
            stock: 20,
            price: 1299,
            details: '13-inch, 8GB RAM, 256GB SSD',
        },
        {
            name: 'Samsung QLED TV',
            description: 'Smart TV with Quantum Dot technology',
            media: '/productPictures/SamsungQled.jpg',
            stock: 10,
            price: 1499,
            details: '65-inch, 4K UHD, HDR',
        },
        {
            name: 'Bose QuietComfort 35 II',
            description: 'Wireless Bluetooth headphones',
            media: '/productPictures/BoseQuietComfort.jpg',
            stock: 45,
            price: 299,
            details: 'Noise-cancelling, Alexa voice control',
        },
        {
            name: 'Fitbit Charge 5',
            description: 'Advanced fitness and health tracker',
            media: '/productPictures/fitbitCharge5.png',
            stock: 60,
            price: 179,
            details: 'Built-in GPS, stress management tools',
        },
        {
            name: 'Microsoft Surface Pro 7',
            description: 'Versatile 2-in-1 laptop',
            media: '/productPictures/MicrosoftSurfacePro7.jpg',
            stock: 25,
            price: 899,
            details: '12.3-inch, Intel Core i5, 8GB RAM, 128GB SSD',
        },
        {
            name: 'Nintendo Switch',
            description: 'Hybrid gaming console',
            media: '/productPictures/NintendoSwitch.jpg',
            stock: 50,
            price: 299,
            details: 'Neon Blue and Red Joy-Con',
        },
        {
            name: 'HP Spectre x360',
            description: 'Convertible laptop with 4K display',
            media: '/productPictures/HPSpectrex360.jpg',
            stock: 20,
            price: 1399,
            details: '13.3-inch, Intel Core i7, 16GB RAM, 512GB SSD',
        },
        {
            name: 'Canon EOS R5',
            description: 'Full-frame mirrorless camera',
            media: '/productPictures/CanonEOSR5.jpg',
            stock: 15,
            price: 3899,
            details: '45MP, 8K video recording',
        },
        {
            name: 'GoPro HERO9',
            description: 'Waterproof action camera',
            media: '/productPictures/GoProHERO9.jpg',
            stock: 50,
            price: 399,
            details: '5K video, 20MP photos',
        }
    ];

    for (const product of products) {
        await prisma.product.create({
            data: {
                name: product.name,
                description: product.description,
                media: product.media,
                stock: product.stock,
                price: product.price,
                details: product.details,
            },
        });
    }
};

(async () => {
    try {
        await main();
        await prisma.$disconnect();
    } catch (error) {
        console.error('Error:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
})();
