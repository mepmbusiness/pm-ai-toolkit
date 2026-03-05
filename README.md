# PM AI Toolkit

Interactive AI-powered tools for Product Managers.

Built with:
- React (Vite)
- Vercel Serverless Functions
- Google Gemini API

## Tools
- PRD Generator
- Hypothesis Validator
- KPI Narrator
- Feedback Analyzer

## Demo
https://pm-ai-toolkit.vercel.app

## Architecture

Frontend:
React + Vite

Backend:
Vercel Serverless API

AI:
Google Gemini (generateContent)

## Example Workflow

1. User enters a product problem
2. Frontend sends POST request to `/api/generate`
3. Serverless function calls Gemini
4. Structured PM output returned to UI
