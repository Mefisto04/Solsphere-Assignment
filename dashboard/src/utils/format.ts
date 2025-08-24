import { formatDistanceToNow } from "date-fns";

export const fmtLastSeen = (iso?: string) =>
    iso ? `${formatDistanceToNow(new Date(iso), { addSuffix: true })}` : "—";
