import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">{t.notfound_title}</h1>
        <p className="mb-4 text-xl text-muted-foreground">{t.notfound_message}</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          {t.notfound_back}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
