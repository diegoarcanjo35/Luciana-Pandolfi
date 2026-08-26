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
          <h1 className="headline-editorial text-2xl text-navy sm:text-3xl">
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
                Não vendemos seus dados, e não os compartilhamos com terceiros para que outras empresas
                façam marketing próprio com eles. Seus dados são compartilhados apenas nestas duas
                situações:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  <strong>Prestadores de infraestrutura técnica</strong> — hospedagem, banco de dados e
                  processamento (Cloudflare) — estritamente para operar o site, armazenar os leads
                  recebidos e viabilizar o atendimento.
                </li>
                <li>
                  <strong>Meta (Facebook/Instagram), como parceira de publicidade e mensuração</strong> —
                  para medirmos o resultado dos nossos próprios anúncios, conforme detalhado na seção
                  seguinte.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-semibold text-navy">
                Cookies, armazenamento local e mensuração de anúncios (Meta Pixel e API de Conversões)
              </h2>
              <p className="mt-2">
                Usamos parâmetros de URL e armazenamento local do navegador (localStorage) para guardar a
                origem da sua visita (UTM de campanha) e associá-la ao formulário que você preencher,
                mesmo que você navegue por mais de uma página antes de enviar.
              </p>
              <p className="mt-2">
                Também usamos o <strong>Meta Pixel</strong> (que roda no seu navegador) e a{" "}
                <strong>API de Conversões da Meta</strong> (que envia o mesmo evento a partir do nosso
                servidor) para medir a eficácia dos nossos anúncios no Facebook e Instagram. As duas vias
                registram o mesmo evento com um identificador em comum (<code>event_id</code>), para que a
                Meta reconheça que se trata do mesmo acontecimento e não o conte em duplicidade.
              </p>
              <p className="mt-2">
                Quando aplicável, dados de contato (como e-mail e telefone) são transformados em um código
                irreversível (hash SHA-256) antes de serem enviados à Meta — a Meta não recebe seu e-mail
                ou telefone em texto simples por essa via. Essas informações são usadas pela Meta para
                mensuração e otimização de campanhas, sujeitas também à política de privacidade da própria
                Meta.
              </p>
              <p className="mt-2">
                Você pode gerenciar cookies e permissões de rastreamento nas configurações do seu
                navegador. O aviso de cookies exibido no site permite recusar o uso de cookies não
                essenciais.
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

            <section className="rounded-sm border border-gold/40 bg-cream-dark/40 p-4">
              <h2 className="font-semibold text-navy">Aviso</h2>
              <p className="mt-2 text-navy/60">
                Este texto foi redigido para descrever de forma transparente e verdadeira como os dados são
                tratados neste site, mas ainda não passou por validação jurídica formal. Recomenda-se
                revisão por um advogado especializado em proteção de dados antes da publicação definitiva
                em produção.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
