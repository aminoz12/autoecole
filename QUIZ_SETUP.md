# Quiz Feature Setup Guide

## Overview
This guide will help you set up the quiz functionality with database storage for user progress tracking.

## ✅ What's Implemented

### 1. **Quiz System**
- 4 fully functional quizzes with 5 questions each:
  - 🚦 **Règles de priorité** (Priority Rules)
  - 🚧 **Panneaux de signalisation** (Road Signs)
  - 📋 **Code général** (General Code)
  - 🚨 **Situations d'urgence** (Emergency Situations)

### 2. **Database Storage**
- `quiz_results` table: Stores every quiz attempt
- User-specific data with Row Level Security (RLS)
- Tracks: score, percentage, time taken, completion date

### 3. **Progress Tracking**
- Real-time statistics display
- Best score for each quiz
- Overall performance metrics:
  - Total quizzes completed
  - Average success rate
  - Total correct answers / total questions

## 🚀 Setup Instructions

### Step 1: Add Database Tables

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/add_quiz_tables.sql`
4. Paste and **Run** the SQL

This will create:
- `quiz_results` table
- `online_courses_progress` table (for future video courses)
- Indexes for performance
- Row Level Security policies

### Step 2: Verify Tables

1. In Supabase, go to **Table Editor**
2. You should see two new tables:
   - `quiz_results`
   - `online_courses_progress`

### Step 3: Test the Quiz System

1. **Login** to your dashboard at `/dashboard`
2. Click the **"Quiz"** tab
3. Click **"Commencer le quiz"** on any quiz
4. Complete the quiz
5. Check your stats - they should update automatically!

## 📊 How It Works

### Quiz Flow
1. User clicks "Commencer le quiz"
2. Quiz modal opens with questions
3. User answers each question
4. System shows immediate feedback
5. On completion, results are saved to database
6. Page refreshes to show updated statistics

### Data Structure

**quiz_results table:**
```sql
- id: UUID (primary key)
- user_id: UUID (references auth.users)
- quiz_id: TEXT ('priority-rules', 'road-signs', etc.)
- quiz_title: TEXT (display name)
- score: INTEGER (number of correct answers)
- total_questions: INTEGER (total questions in quiz)
- percentage: INTEGER (success rate 0-100)
- time_taken_seconds: INTEGER (completion time)
- completed_at: TIMESTAMP (when completed)
- created_at: TIMESTAMP (when record created)
```

### Statistics Calculation

**Per Quiz:**
- Best score: Highest score achieved for that specific quiz
- Best percentage: Best success rate for that quiz

**Overall (Progress Card):**
- Quiz complétés: COUNT of all quiz attempts
- Taux de réussite: AVERAGE of all percentages
- Bonnes réponses: SUM of correct / SUM of total questions

## 🎨 Features

### Quiz Component Features
- ✅ Question navigation (Previous/Next)
- ✅ Answer selection
- ✅ Instant feedback (correct/incorrect)
- ✅ Explanations for each answer
- ✅ Progress bar
- ✅ Score tracking
- ✅ Time tracking
- ✅ Beautiful completion screen
- ✅ Restart option

### Dashboard Features
- ✅ Tab navigation (Reservations / Courses / Quiz)
- ✅ Real-time statistics
- ✅ Best score display per quiz
- ✅ "Recommencer" button if already completed
- ✅ Overall progress card

## 🔒 Security

- **Row Level Security (RLS)** enabled
- Users can only:
  - View their own quiz results
  - Create their own quiz results
  - Cannot modify or delete results (data integrity)
- User ID automatically attached from auth session

## 🎯 Quiz IDs Reference

Use these IDs when creating new quizzes:
- `priority-rules` - Règles de priorité
- `road-signs` - Panneaux de signalisation
- `general-code` - Code général
- `emergency-situations` - Situations d'urgence

## 📝 Adding New Quizzes

To add a new quiz:

1. **Add questions** to `components/dashboard/quizData.ts`:
```typescript
export const myNewQuiz: Question[] = [
  {
    id: 1,
    question: "Your question here?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 0, // index of correct answer
    explanation: "Explanation here"
  },
  // ... more questions
]
```

2. **Import** in `DashboardContent.tsx`:
```typescript
import { myNewQuiz } from './quizData'
```

3. **Add quiz card** in the Quiz section:
```tsx
<button 
  onClick={() => setActiveQuiz({ 
    title: 'Quiz - My New Quiz', 
    id: 'my-new-quiz', 
    questions: myNewQuiz 
  })}
  className="w-full bg-primary text-white py-2 rounded-lg"
>
  Commencer le quiz
</button>
```

## 🐛 Troubleshooting

### Issue: Quiz results not saving
**Solution:** 
1. Check Supabase SQL Editor for errors
2. Verify RLS policies are enabled
3. Check browser console for errors
4. Ensure user is authenticated

### Issue: Statistics not updating
**Solution:**
1. Hard refresh the page (Ctrl + Shift + R)
2. Check if quiz_results table has data
3. Verify user_id matches in database

### Issue: "Cannot read quiz_results table"
**Solution:**
1. Run the SQL migration again
2. Check RLS policies are created
3. Verify user is logged in

## 📈 Future Enhancements

Potential improvements:
- [ ] Quiz history timeline
- [ ] Detailed answer review
- [ ] Quiz categories/difficulty levels
- [ ] Leaderboard (optional)
- [ ] Certificate generation
- [ ] Quiz recommendations based on weak areas
- [ ] Video course tracking integration

## 🎉 Success!

Once setup is complete, users will be able to:
- Take quizzes and see immediate feedback
- Track their progress over time
- See their best scores
- Monitor overall performance
- Retake quizzes to improve scores

All data is automatically saved to the database and persists across sessions!

