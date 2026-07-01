-- Permite que usuários autenticados com e-mails de admin leiam as submissions.
-- Os e-mails autorizados devem coincidir com ALLOWED_ADMIN_EMAILS em frontend/src/lib/admin.ts.
create policy "Admins can read contact submissions"
  on contact_submissions
  for select
  to authenticated
  using (
    lower(auth.jwt() ->> 'email') = any(array[
      'thiagosiqueiramorello@gmail.com',
      'morello@capistudio.com'
    ])
  );
