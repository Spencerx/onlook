import { useEditorEngine } from '@/components/store/editor';
import { useStateManager } from '@/components/store/state';
import { api } from '@/trpc/react';
import { Button } from '@onlook/ui/button';
import { Icons } from '@onlook/ui/icons';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

export const ErrorMessage = observer(() => {
    const editorEngine = useEditorEngine();
    const stateManager = useStateManager();
    const error = editorEngine.chat.error.message;
    const usage = editorEngine.chat.error.usage;
    const isUsageError = usage && usage.usageCount >= usage.limitCount;

    const { data: usageData, refetch: refetchUsage } = api.usage.get.useQuery();

    useEffect(() => {
        if (isUsageError) {
            // Start polling for subscription changes.
            const interval = setInterval(() => {
                refetchUsage();
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [isUsageError]);

    // Clear error when usage data shows user is no longer over limit
    useEffect(() => {
        const isUnderLimit = usageData && usageData.daily.usageCount < usageData.daily.limitCount && usageData.monthly.usageCount < usageData.monthly.limitCount;
        if (isUsageError && isUnderLimit) {
            editorEngine.chat.error.usage = null;
        }
    }, [usageData, isUsageError]);

    if (isUsageError) {
        return (
            <div className="flex w-full flex-col items-center justify-center gap-2 text-small px-4 pb-4">
                <p className="text-foreground-secondary text-mini my-1 text-blue-300 select-none">
                    You reached your {usage.limitCount} {usage.period === 'day' ? 'daily' : 'monthly'} message limit.
                </p>
                <Button
                    className="w-full mx-10 bg-blue-500 text-white border-blue-400 hover:border-blue-200/80 hover:text-white hover:bg-blue-400 shadow-blue-500/50 hover:shadow-blue-500/70 shadow-lg transition-all duration-300"
                    onClick={() => (stateManager.isSubscriptionModalOpen = true)}
                >
                    Get more {usage.period === 'day' ? 'daily' : 'monthly'} messages
                </Button>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex w-full flex-row items-center justify-center gap-2 p-2 text-small text-red">
                <Icons.ExclamationTriangle className="w-6" />
                <p className="w-5/6 text-wrap overflow-auto">{error}</p>
            </div>
        );
    }
    return null;
});
