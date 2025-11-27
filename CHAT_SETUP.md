# Chat Feature Setup Guide

This app includes a floating chat button that provides AI-powered assistance for menstrual and maternal health questions using OpenAI's ChatGPT API.

## Setup Instructions

### 1. Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy your API key (it will look like: `sk-...`)

### 2. Store the API Key in Firebase Firestore

The API key is stored securely in Firebase Firestore instead of being hardcoded in the app.

**Steps to configure:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`sakhisetu-7069d`)
3. Navigate to **Firestore Database**
4. Click **Start collection** (if you don't have one yet) or navigate to existing collections
5. Create a collection named: `appConfigKratika`
6. Create a document with ID: `openai`
7. Add a field:
   - **Field name**: `apiKey`
   - **Type**: `string`
   - **Value**: Your OpenAI API key (e.g., `sk-...`)

**Firestore Structure:**
```
appConfig (collection)
  └── openai (document)
      └── apiKey: "sk-your-actual-api-key-here"
```

### 3. Set Up Firestore Security Rules (Important!)

To protect your API key, set up security rules in Firebase Console:

1. Go to **Firestore Database** → **Rules** tab
2. Add the following rule to restrict access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read appConfig (for API key)
    match /appConfig/{document} {
      allow read: if request.auth != null; // Only authenticated users
      allow write: if false; // No one can write (only admins via console)
    }
    
    // Your existing rules for other collections...
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Note:** For production, consider:
- Creating an admin-only collection that only admins can read
- Using Firebase Functions to proxy API calls instead of exposing the key to clients
- Implementing rate limiting

### 3. Security Note

⚠️ **Important**: For production apps, consider:
- Using environment variables instead of hardcoding the API key
- Storing the API key securely on a backend server
- Implementing rate limiting and usage monitoring
- Never commit API keys to version control

### 4. Alternative: Admin-Only Configuration (More Secure)

For better security, you can create an admin-only collection:

1. Create collection: `adminConfig`
2. Create document: `openai`
3. Add field: `apiKey`
4. Update Firestore rules to only allow admin users:

```javascript
match /adminConfig/{document} {
  allow read: if request.auth != null && 
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
  allow write: if false;
}
```

Then update `config/openai.js` to fetch from `adminConfig` instead of `appConfig`.

### 5. Usage

Once configured:
1. Log in to the app
2. You'll see a floating chat button (pink circle with chat icon) in the bottom right corner
3. Tap the button to open the chat interface
4. Ask questions about menstrual health, pregnancy, postpartum care, etc.
5. The AI assistant will provide helpful, evidence-based information

### 6. Features

- **Floating Button**: Always accessible on all screens after login
- **AI-Powered**: Uses OpenAI's GPT-3.5-turbo model
- **Specialized**: Trained to provide menstrual and maternal health information
- **User-Friendly**: Clean, modern chat interface
- **Error Handling**: Graceful error messages if API issues occur

### 7. Troubleshooting

**Chat not working?**
- Check that your API key is correctly stored in Firestore (`appConfig/openai` collection)
- Verify the document ID is exactly `openai` and field name is `apiKey`
- Check that you're authenticated (logged in) when using the chat
- Verify your OpenAI account has credits/usage available
- Check the console for error messages

**API Key Error?**
- Ensure the key starts with `sk-`
- Make sure there are no extra spaces or quotes in Firestore
- Verify the key is active in your OpenAI account
- Check Firestore security rules allow authenticated users to read `appConfig`

**Firestore Access Error?**
- Ensure you're logged in to the app
- Check Firestore security rules allow read access to `appConfig/openai`
- Verify the collection and document names match exactly: `appConfig` → `openai`

**Rate Limit Errors?**
- OpenAI has rate limits based on your account tier
- Wait a moment and try again
- Consider upgrading your OpenAI plan for higher limits

## Cost Considerations

OpenAI API usage is charged based on:
- Number of tokens (words/characters) processed
- Model used (GPT-3.5-turbo is cost-effective)
- Current pricing: ~$0.002 per 1K tokens

For a typical conversation, costs are usually very low (cents per conversation).

