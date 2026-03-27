import type { Metadata } from "next";
import { Container } from "@/components/layout/Container/Container";
import { brand } from "@config/brand";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Saiba como tratamos seus dados pessoais em conformidade com a LGPD.",
};

export default function PoliticaDePrivacidadePage() {
  const whatsappNumber = brand.contact.whatsapp.replace(/\D/g, "");

  return (
    <Container className="py-16 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-950 mb-2">
        Política de Privacidade
      </h1>
      <p className="text-xs text-stone-400 mb-10">
        Última atualização: 20 de março de 2026
      </p>

      <div className="space-y-10 text-sm leading-relaxed text-stone-600">
        {/* 1 */}
        <section>
          <h2 className="text-base font-semibold text-stone-950 mb-3">
            1. Quem Somos
          </h2>
          <p>
            A <strong>{brand.name}</strong> é responsável pelo tratamento dos seus
            dados pessoais coletados por meio deste site e dos nossos canais de
            atendimento.
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-1.5">
            <li>
              E-mail de contato:{" "}
              <a
                href={`mailto:${brand.contact.email}`}
                className="underline text-stone-950 font-medium"
              >
                {brand.contact.email}
              </a>
            </li>
            <li>
              WhatsApp:{" "}
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-stone-950 font-medium"
              >
                {brand.contact.whatsapp}
              </a>
            </li>
          </ul>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-base font-semibold text-stone-950 mb-3">
            2. Dados que Coletamos
          </h2>
          <p>Coletamos apenas os dados estritamente necessários:</p>
          <ul className="list-disc pl-5 mt-3 space-y-1.5">
            <li>
              <strong>Via WhatsApp:</strong> nome, telefone, endereço de entrega e
              detalhes do pedido.
            </li>
            <li>
              <strong>No site:</strong> nenhum dado pessoal é coletado
              automaticamente. Não utilizamos cadastro, login ou formulários.
            </li>
            <li>
              <strong>Armazenamento local (localStorage):</strong> sua sacola de
              compras é salva apenas no seu dispositivo e nunca é enviada aos
              nossos servidores.
            </li>
          </ul>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-base font-semibold text-stone-950 mb-3">
            3. Para que Usamos seus Dados
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Processar e entregar seus pedidos.</li>
            <li>Comunicar sobre o status do pedido e informações de envio.</li>
            <li>Cumprir obrigações fiscais e legais (emissão de nota fiscal).</li>
            <li>Responder a dúvidas e solicitações de atendimento.</li>
          </ul>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-base font-semibold text-stone-950 mb-3">
            4. Base Legal para o Tratamento
          </h2>
          <p>
            O tratamento dos seus dados é fundamentado nas seguintes bases legais
            da <strong>LGPD (Lei 13.709/2018)</strong>:
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-1.5">
            <li>
              <strong>Execução de contrato</strong> (Art. 7º, V) — para processar
              e entregar seus pedidos.
            </li>
            <li>
              <strong>Obrigação legal</strong> (Art. 7º, II) — para cumprimento de
              obrigações fiscais.
            </li>
            <li>
              <strong>Consentimento</strong> (Art. 7º, I) — caso você autorize o
              envio de comunicações de marketing.
            </li>
          </ul>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-base font-semibold text-stone-950 mb-3">
            5. Compartilhamento de Dados
          </h2>
          <p>Seus dados podem ser compartilhados com:</p>
          <ul className="list-disc pl-5 mt-3 space-y-1.5">
            <li>
              <strong>Transportadoras</strong> — nome e endereço para entrega dos
              pedidos.
            </li>
            <li>
              <strong>WhatsApp (Meta)</strong> — como plataforma de comunicação para
              atendimento e checkout.
            </li>
          </ul>
          <p className="mt-3">
            <strong>Não vendemos, alugamos ou comercializamos</strong> seus dados
            pessoais com terceiros.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-base font-semibold text-stone-950 mb-3">
            6. Seus Direitos (Art. 18, LGPD)
          </h2>
          <p>Você tem direito a:</p>
          <ul className="list-disc pl-5 mt-3 space-y-1.5">
            <li>Confirmar a existência de tratamento dos seus dados.</li>
            <li>Acessar seus dados pessoais.</li>
            <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
            <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários.</li>
            <li>Solicitar a portabilidade dos seus dados.</li>
            <li>Obter informações sobre com quem seus dados são compartilhados.</li>
            <li>Revogar o consentimento a qualquer momento.</li>
            <li>
              Apresentar reclamação perante a{" "}
              <strong>Autoridade Nacional de Proteção de Dados (ANPD)</strong>.
            </li>
          </ul>
          <p className="mt-3">
            Para exercer qualquer desses direitos, entre em contato pelo e-mail{" "}
            <a
              href={`mailto:${brand.contact.email}`}
              className="underline text-stone-950 font-medium"
            >
              {brand.contact.email}
            </a>{" "}
            ou pelo nosso{" "}
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-stone-950 font-medium"
            >
              WhatsApp
            </a>
            . Responderemos em até <strong>15 dias úteis</strong>.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="text-base font-semibold text-stone-950 mb-3">
            7. Cookies e Armazenamento Local
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              Este site utiliza apenas <strong>cookies essenciais</strong> para o
              funcionamento técnico. Não utilizamos cookies de rastreamento ou
              publicidade.
            </li>
            <li>
              Utilizamos <strong>localStorage</strong> para salvar sua sacola de
              compras. Esses dados ficam armazenados exclusivamente no seu
              dispositivo e não são transmitidos aos nossos servidores.
            </li>
          </ul>
        </section>

        {/* 8 */}
        <section>
          <h2 className="text-base font-semibold text-stone-950 mb-3">
            8. Segurança
          </h2>
          <p>
            Adotamos medidas de segurança para proteger seus dados pessoais,
            incluindo conexão criptografada (HTTPS) e acesso restrito às
            informações de pedidos.
          </p>
        </section>

        {/* 9 */}
        <section>
          <h2 className="text-base font-semibold text-stone-950 mb-3">
            9. Retenção de Dados
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              Dados de pedidos são mantidos por até <strong>5 anos</strong> para
              cumprimento de obrigações fiscais.
            </li>
            <li>
              Demais dados pessoais serão excluídos mediante solicitação, salvo
              quando houver obrigação legal de retenção.
            </li>
          </ul>
        </section>

        {/* 10 */}
        <section>
          <h2 className="text-base font-semibold text-stone-950 mb-3">
            10. Alterações nesta Política
          </h2>
          <p>
            Esta política pode ser atualizada periodicamente. Recomendamos que você
            a consulte regularmente. A data da última atualização será sempre
            indicada no topo desta página.
          </p>
        </section>

        {/* 11 */}
        <section>
          <h2 className="text-base font-semibold text-stone-950 mb-3">
            11. Legislação Aplicável
          </h2>
          <p>
            Esta política está em conformidade com a{" "}
            <strong>Lei Geral de Proteção de Dados (Lei 13.709/2018)</strong> e
            demais legislações brasileiras aplicáveis.
          </p>
        </section>
      </div>
    </Container>
  );
}
