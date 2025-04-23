
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Emotion = "very_bad" | "bad" | "neutral" | "good" | "very_good";

interface EmojiRatingProps {
  value: Emotion;
  onChange: (value: Emotion) => void;
  className?: string;
}

const emotionData: { value: Emotion; emoji: string; label: string }[] = [
  { value: "very_bad", emoji: "😠", label: "Очень плохо" },
  { value: "bad", emoji: "😞", label: "Плохо" },
  { value: "neutral", emoji: "😐", label: "Нейтрально" },
  { value: "good", emoji: "😊", label: "Хорошо" },
  { value: "very_good", emoji: "😄", label: "Очень хорошо" },
];

export const EmojiRating: React.FC<EmojiRatingProps> = ({ 
  value, 
  onChange,
  className 
}) => {
  return (
    <div className={cn("flex justify-between gap-1", className)}>
      {emotionData.map((emotion) => (
        <Button
          key={emotion.value}
          type="button"
          variant={value === emotion.value ? "default" : "outline"}
          className="flex-1 text-2xl p-2 h-auto"
          onClick={() => onChange(emotion.value)}
          title={emotion.label}
        >
          {emotion.emoji}
          <span className="sr-only">{emotion.label}</span>
        </Button>
      ))}
    </div>
  );
};

export const getEmotionEmoji = (emotion?: Emotion): string => {
  if (!emotion) return "😐";
  return emotionData.find(item => item.value === emotion)?.emoji || "😐";
};

export const getEmotionLabel = (emotion?: Emotion): string => {
  if (!emotion) return "Нейтрально";
  return emotionData.find(item => item.value === emotion)?.label || "Нейтрально";
};

