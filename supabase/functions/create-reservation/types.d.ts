declare module "npm:nodemailer@6.9.2" {
  const nodemailer: {
    createTransport(config: any): {
      sendMail(message: any): Promise<any>;
    };
  };

  export default nodemailer;
}

declare module "https://esm.sh/@supabase/supabase-js@2" {
  export function createClient(url: string, key: string): any;
}
