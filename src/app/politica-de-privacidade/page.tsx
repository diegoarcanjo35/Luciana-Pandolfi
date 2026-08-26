import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  alternates: { canonical: `${SITE_URL}/politica-de-privacidade` },
  robots: { index: false, follow: true },
};

export default function PoliticaDePrivacidadePage() {
  return (
    <>
      <Header />
      <main className="flex-1 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-serif-display text-2xl font-semibold text-navy sm:text-3xl">
            Política de Privacidade
          </h1>
          <p className="mt-2 text-sm text-navy/50">Última atualização: 26 de agosto de 2026.</p>

          <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-navy/65">
            <p>
              Esta política explica como a <strong>L&amp;J Consultoria e Negócios Ltda</strong> (&ldquo;nós&rdquo;),
              responsável pelo site e pela consultoria em planos de saúde da Luciana Pandolfi, trata os
              dados pessoais coletados por aqui, em conformidade com a Lei Geral de Proteção de Dados
              (Lei nº 13.709/2018 — LGPD).
            </p>

            <section>
              <h2 className="font-semibold text-navy">Quais dados coletamos</h2>
              <p className="mt-2">
                Nome, WhatsApp e e-mail, informados voluntariamente nos formulários do site. Nos
                formulários de análise completa, também coletamos: se a consulta é para você, sua
                família, sua empresa (CNPJ) ou seus pais; quantidade de pessoas a incluir no plano; se
                você já possui plano hoje; prazo para decisão; hospital de preferência (opcional); e,
                na página de planos empresariais, o número de vidas da empresa. Também registramos a
                origem do seu acesso (UTM de campanha) para sabermos qual anúncio ou conteúdo trouxe você
                até aqui.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-navy">Para que usamos esses dados</h2>
              <p className="mt-2">
                Exclusivamente para entrar em contato com você sobre a consultoria de planos de saúde:
                enviar a análise comparativa solicitada, o guia gratuito de hospitais de referência, e
                dar continuidade ao atendimento pelo WhatsApp. Também usamos os dados de origem (UTM) para
                medir o desempenho dos nossos anúncios e conteúdos.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-navy">Com quem compartilhamos</h2>
              <p className="mt-2">
                Não vendemos nem compartilhamos seus dados com terceiros para fins de marketing de outras
                empresas. Seus dados podem ser processados por prestadores de infraestrutura técnica (como
                hospedagem e banco de dados) estritamente para operar o site e o atendimento.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-navy">Cookies e mensuração</h2>
              <p className="mt-2">
                Usamos cookies e parâmetros de URL (UTM) para entender de onde vêm nossos visitantes e
                medir a eficácia de campanhas de anúncio. Você pode gerenciar cookies nas configurações do
                seu navegador.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-navy">Seus direitos</h2>
              <p className="mt-2">
                Você pode solicitar a qualquer momento a confirmação, o acesso, a correção ou a exclusão
                dos seus dados pessoais, entrando em contato pelo WhatsApp informado no site.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-navy">Contato</h2>
              <p className="mt-2">
                Dúvidas sobre esta política ou sobre o tratamento dos seus dados podem ser enviadas pelo
                WhatsApp de atendimento disponível em todas as páginas do site.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
