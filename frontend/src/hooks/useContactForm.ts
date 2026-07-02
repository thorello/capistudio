import { useState, type FormEvent } from "react";
import { NewContactSubmission } from "../domain/NewContactSubmission";
import { useServices } from "../composition/ServicesContext";
import { toErrorMessage } from "../utils/toErrorMessage";
import { isValidEmail } from "../utils/sanitize";
export type ContactFormStatus = "idle" | "loading" | "success" | "error";

export function useContactForm() {
  const { contactWriter } = useServices();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<ContactFormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const submission = NewContactSubmission.create({ name, email, message });

      if (!submission.name || !submission.message) {
        throw new Error("Preencha todos os campos.");
      }

      if (!isValidEmail(submission.email)) {
        throw new Error("E-mail inválido.");
      }

      await contactWriter.submit(submission);      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(toErrorMessage(error, "Erro ao enviar mensagem"));
    }
  }

  return {
    name,
    setName,
    email,
    setEmail,
    message,
    setMessage,
    status,
    errorMessage,
    handleSubmit,
  };
}
