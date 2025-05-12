# SpiritsVault Mobile App

SpiritsVault is a social platform for spirit enthusiasts to discover, review, and share their favorite drinks with a community of like-minded individuals.

## Features

### Authentication
- Login and signup screens with form validation
- Google sign-in option
- Skip authentication during development

### Theme System
- Dark mode (default) and light mode
- Theme toggle button available on all screens
- Consistent color palette across the app

### Home Screen
- Social feed with posts from other users
- Like, comment, and share functionality
- Bookmark favorite posts
- Search functionality

### Collection Screen
- Grid view of spirits with images
- Filter by category, price range, and taste profile
- Search functionality
- Detailed view of each spirit

### Spirit Detail Screen
- Comprehensive spirit information (name, category, price, rating, origin, ABV)
- Taste profile visualization
- User reviews
- Add to personal collection option

### Instagram-Style Create Post Flow
- "+" button in the center of bottom tab bar
- Two-step posting process:
  1. Camera screen for capturing photos (currently mocked)
  2. Post creation form with spirit selection, rating, and review
- Shared post appears at the top of the home feed
- Real-time feed updates

### Navigation
- Bottom tab navigation with centered "+" button (Instagram-style)
- Stack navigation for detail views
- Custom header with theme toggle

## Technical Details

- Built with React Native and Expo
- TypeScript for type safety
- Context API for state management (theme, authentication)
- Custom components for reusability
- Responsive design supporting various screen sizes

## Setup and Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/SpiritsVault.git
cd SpiritsVault
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm start
# or
yarn start
```

4. Run on iOS or Android
```bash
npm run ios
# or
npm run android
```

## Future Enhancements

- User profile management
- Spirit recommendation engine
- Real camera implementation for photo capture
- Barcode scanning for quick spirit lookup
- Location-based spirit shop finder
- Community tasting events
- Integration with e-commerce platforms

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 