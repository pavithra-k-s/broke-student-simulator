import React from 'react';
import { GameEvent } from '../../types/gameplay';
import { formatINR } from '../../utils/currency';
import { PixelBadge } from '../common/PixelBadge';
import { PixelButton } from '../common/PixelButton';
import { CheckCircle } from 'lucide-react';

interface EventDialogueProps {
  event: GameEvent | null;
  eventResolved: boolean;
  selectedChoiceId: string | null;
  onSelectChoice: (choiceId: string) => void;
}

export const EventDialogue: React.FC<EventDialogueProps> = ({
  event,
  eventResolved,
  selectedChoiceId,
  onSelectChoice,
}) => {
  if (!event) {
    return (
      <div className="bg-retro-panel border-2 border-retro-border p-6 text-center font-mono text-xs text-cream-muted">
        No campus events currently active today. All is quiet in the hostel... for now.
      </div>
    );
  }

  return (
    <div className="bg-retro-panel border-4 border-retro-border p-5 sm:p-6 shadow-pixel-lg relative">
      {/* Corner Pixel Notches */}
      <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-neon-lime" />
      <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-neon-lime" />
      <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-neon-lime" />
      <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-neon-lime" />

      {/* Event Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-retro-border/60 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{event.emoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-pixel text-xs sm:text-sm text-cream uppercase">
                {event.title}
              </h3>
              <PixelBadge
                variant={
                  event.category === 'Disaster'
                    ? 'danger'
                    : event.category === 'Luck'
                    ? 'lime'
                    : event.category === 'Food'
                    ? 'amber'
                    : 'lavender'
                }
                size="sm"
              >
                {event.category}
              </PixelBadge>
            </div>
            <p className="font-mono text-xs text-cream-muted">Campus Situation Encounter</p>
          </div>
        </div>

        <div>
          {eventResolved ? (
            <PixelBadge variant="lime" size="sm">
              DECISION RECORDED
            </PixelBadge>
          ) : (
            <PixelBadge variant="amber" size="sm" className="animate-pulse">
              ACTION REQUIRED
            </PixelBadge>
          )}
        </div>
      </div>

      {/* Event Description in RPG Dialogue Box */}
      <div className="p-4 bg-retro-dark border-2 border-retro-border mb-5 text-xs sm:text-sm font-mono text-cream leading-relaxed">
        <p className="text-cream italic">"{event.description}"</p>
      </div>

      {/* Choices Section */}
      <div className="space-y-3">
        <p className="font-pixel text-[10px] text-cream-muted uppercase tracking-wider mb-2">
          {eventResolved ? 'CHOSEN PATH & OUTCOME:' : 'HOW DO YOU RESPOND, PLAYER?'}
        </p>

        {event.choices.map((choice, index) => {
          const isSelected = selectedChoiceId === choice.id;
          const cost = choice.costPaise;
          const isGain = cost < 0;
          const isFree = cost === 0;

          return (
            <div
              key={choice.id}
              className={`p-3 border-2 transition-all ${
                isSelected
                  ? 'bg-retro-panel-light border-neon-lime shadow-pixel-sm'
                  : eventResolved
                  ? 'opacity-40 border-retro-border bg-retro-dark'
                  : 'bg-retro-dark hover:bg-retro-panel-light/60 border-retro-border hover:border-cream-muted'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <span className="font-pixel text-xs text-neon-lime mt-0.5">
                    [{index + 1}]
                  </span>
                  <div>
                    <p className="font-mono text-xs text-cream font-bold">
                      {choice.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`font-pixel text-[10px] ${
                          isGain
                            ? 'text-neon-lime'
                            : isFree
                            ? 'text-lavender'
                            : 'text-danger-red'
                        }`}
                      >
                        {isGain
                          ? `+${formatINR(Math.abs(cost))}`
                          : isFree
                          ? 'FREE (₹0)'
                          : `-${formatINR(cost)}`}
                      </span>
                      <span className="font-mono text-[10px] text-cream-muted">
                        • +{choice.xpReward} XP
                      </span>
                    </div>
                  </div>
                </div>

                {!eventResolved && (
                  <div className="self-end sm:self-center shrink-0">
                    <PixelButton
                      variant={isFree ? 'lavender' : isGain ? 'lime' : 'panel'}
                      size="sm"
                      onClick={() => onSelectChoice(choice.id)}
                      className="text-[10px]"
                    >
                      CHOOSE
                    </PixelButton>
                  </div>
                )}

                {isSelected && (
                  <div className="flex items-center gap-1.5 text-neon-lime font-mono text-xs shrink-0">
                    <CheckCircle size={15} />
                    <span>LOCKED IN</span>
                  </div>
                )}
              </div>

              {/* Show Outcome if this choice was picked */}
              {isSelected && (
                <div className="mt-3 pt-3 border-t border-retro-border/80 space-y-1.5 font-mono text-xs">
                  <p className="text-cream">
                    <strong>Result:</strong> {choice.outcomeText}
                  </p>
                  <p className="text-amber italic">
                    <strong>Reaction:</strong> "{choice.reaction}"
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
