import { useEffect, useState } from "react";
import type { ContactSubmission } from "../domain/ContactSubmission";
import { useServices } from "../composition/ServicesContext";
import { toErrorMessage } from "../utils/toErrorMessage";

export function useSubmissions() {
  const { contactReader } = useServices();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!contactReader) {
      setError("Supabase não configurado.");
      setLoading(false);
      return;
    }

    contactReader
      .findAll()
      .then(setSubmissions)
      .catch((err) => setError(toErrorMessage(err, "Erro ao carregar mensagens.")))
      .finally(() => setLoading(false));
  }, [contactReader]);

  return { submissions, loading, error };
}
