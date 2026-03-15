import { AuthDemoPage } from "@/modules/auth/ui/auth-demo-page";
import { getAuthProviderStatuses } from "@/modules/auth/model/provider-config";

export default function AuthPage() {
  return <AuthDemoPage providers={getAuthProviderStatuses()} />;
}
