'use client';

import { use } from 'react';
import WaitingRoom from '@/components/WaitingRoom';

export default function WaitingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <WaitingRoom challengeId={resolvedParams.id} />;
} 