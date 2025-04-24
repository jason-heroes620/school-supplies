// resources/js/components/Providers.tsx
import { Provider } from "react-redux";
import { store, RootState } from "@/store/store";
import { ReactNode } from "react";

interface ProvidersProps {
    children: ReactNode;
    initialState?: Partial<RootState>;
}

export default function Providers({ children, initialState }: ProvidersProps) {
    // In a real app, you might want to create a new store here with initial state
    // For simplicity, we're using the default store
    return <Provider store={store}>{children}</Provider>;
}
