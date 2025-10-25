using Api.DTOs;
using System;
using System.Collections.Generic;

namespace Api.Helpers
{
    public static class ReviewValidator
    {
        public static bool Validate(CreateReviewDto review, out string errorMessage)
        {
            if (review == null)
            {
                errorMessage = "Review data is missing.";
                return false;
            }

            if (string.IsNullOrWhiteSpace(review.Title))
            {
                errorMessage = "Title cannot be empty.";
                return false;
            }

            if (string.IsNullOrWhiteSpace(review.ReviewContent))
            {
                errorMessage = "Review content cannot be empty.";
                return false;
            }

            var scores = new Dictionary<string, double>
            {
                { nameof(review.OverallScore), review.OverallScore },
                { nameof(review.StyleScore), review.StyleScore },
                { nameof(review.StoryScore), review.StoryScore },
                { nameof(review.GrammarScore), review.GrammarScore },
                { nameof(review.CharacterScore), review.CharacterScore }
            };

            foreach (var (field, score) in scores)
            {
                if (!IsValidScore(score, out var scoreError))
                {
                    errorMessage = $"{field}: {scoreError}";
                    return false;
                }
            }

            errorMessage = string.Empty;
            return true;
        }

        public static bool Validate(UpdateReviewDto review, out string errorMessage)
        {
            if (review == null)
            {
                errorMessage = "Review data is missing.";
                return false;
            }

            if (review.Title != null && string.IsNullOrWhiteSpace(review.Title))
            {
                errorMessage = "Title cannot be empty if provided.";
                return false;
            }

            if (review.ReviewContent != null && string.IsNullOrWhiteSpace(review.ReviewContent))
            {
                errorMessage = "Review content cannot be empty if provided.";
                return false;
            }

            var scores = new Dictionary<string, double?>
            {
                { nameof(review.OverallScore), review.OverallScore },
                { nameof(review.StyleScore), review.StyleScore },
                { nameof(review.StoryScore), review.StoryScore },
                { nameof(review.GrammarScore), review.GrammarScore },
                { nameof(review.CharacterScore), review.CharacterScore }
            };

            foreach (var (field, score) in scores)
            {
                if (score.HasValue && !IsValidScore(score.Value, out var scoreError))
                {
                    errorMessage = $"{field}: {scoreError}";
                    return false;
                }
            }

            errorMessage = string.Empty;
            return true;
        }

        private static bool IsValidScore(double score, out string error)
        {
            if (score < 0 || score > 5)
            {
                error = "must be between 0 and 5.";
                return false;
            }

            if (Math.Abs(score * 2 % 1) > 0.0001)
            {
                error = "must be in 0.5 increments.";
                return false;
            }

            error = string.Empty;
            return true;
        }
    }
}
