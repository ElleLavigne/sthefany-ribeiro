import type { Metadata } from "next";
import { Container } from "@/components/layout/Container/Container";
import { brand } from "@config/brand";

export const metadata: Metadata = {
  title: "Política de Trocas e Devoluções",
  description:
    "Conheça nossa política de trocas e devoluções conforme o Código de Defesa do Consumidor.",
};

export default function PoliticaDeTrocasPage() {
  const whatsappNumber = brand.contact.whatsapp.replace(/\D/g, "");

  return (
    <Container className="py-16 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-950 mb-2">
        Política de Trocas e Devoluções
      </h1>
      <p className="text-xs text-stone-400 mb-10">
        Última atualização: 20 de março de 2026
      </p>

      <div className="space-y-10 text-sm leading-relaxed text-stone-600">
        {/* 1 */}
        <section>
          <h2 className="text-base font-semibold text-stone-950 mb-3">
            1. Direito de Arrependimento
          </h2>
          <p>
            De acordo com o <strong>Art. 49 do Código de Defesa do Consumidor</strong>,
            você tem o direito de desistir da compra em até{" "}
            <strong>7 (sete) dias corridos</strong> após o recebimento do produto,
            sem necessidade de justificativa.
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-1.5">
            <li>O produto deve estar sem uso, com etiquetas e na embalagem original.</li>
            <li>O reembolso será integral, incluindo o valor do frete original.</li>
            <li>O frete de devolução será por nossa conta.</li>
            <li>
              O reembolso será realizado em até 7 dias úteis após o recebimento
              do produto devolvido, via Pix ou transferência bancária.
            </li>
          </ul>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-base font-semibold text-stone-950 mb-3">
            2. Produtos com Defeito
          </h2>
          <p>
            Conforme o <strong>Art. 18 do CDC</strong>, você tem até{" "}
            <strong>30 (trinta) dias corridos</strong> após o recebimento para
            relatar defeitos no produto.
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-1.5">
            <li>
              Para defeitos aparentes (costura solta, mancha, peça errada), o prazo
              começa na data de entrega.
            </li>
            <li>
              Para defeitos ocultos, o prazo começa quando o defeito for identificado.
            </li>
            <li>
              Você pode optar por: <strong>troca do produto</strong>,{" "}
              <strong>reembolso integral</strong> ou{" "}
              <strong>abatimento proporcional no valor</strong>.
            </li>
            <li>O frete de devolução será por nossa conta.</li>
          </ul>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-base font-semibold text-stone-950 mb-3">
            3. Troca de Tamanho
          </h2>
          <p>
            Oferecemos troca de tamanho em até <strong>7 dias corridos</strong> após
            o recebimento, desde que:
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-1.5">
            <li>O produto esteja sem uso, com etiquetas e na embalagem original.</li>
            <li>Haja disponibilidade do tamanho desejado em estoque.</li>
            <li>O frete de envio da troca por tamanho será por conta do cliente.</li>
          </ul>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-base font-semibold text-stone-950 mb-3">
            4. Como Solicitar
          </h2>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>
              Entre em contato pelo nosso{" "}
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-stone-950 font-medium"
              >
                WhatsApp
              </a>{" "}
              ou e-mail{" "}
              <a
                href={`mailto:${brand.contact.email}`}
                className="underline text-stone-950 font-medium"
              >
                {brand.contact.email}
              </a>
              .
            </li>
            <li>Informe o número do pedido, o produto e o motivo da solicitação.</li>
            <li>Nossa equipe enviará as instruções de envio.</li>
            <li>
              Após o recebimento e análise do produto, processaremos a troca ou
              reembolso em até <strong>7 dias úteis</strong>.
            </li>
          </ol>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-base font-semibold text-stone-950 mb-3">
            5. Itens Não Elegíveis
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Produtos com sinais de uso, sem etiquetas ou fora da embalagem original.</li>
            <li>Peças íntimas e acessórios personalizados por questões de higiene.</li>
            <li>Produtos adquiridos em promoções indicadas como &quot;venda final&quot;.</li>
          </ul>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-base font-semibold text-stone-950 mb-3">
            6. Legislação Aplicável
          </h2>
          <p>
            Esta política segue as disposições do{" "}
            <strong>Código de Defesa do Consumidor (Lei 8.078/1990)</strong> e do{" "}
            <strong>Decreto 7.962/2013</strong> que regulamenta o comércio
            eletrônico no Brasil.
          </p>
        </section>
      </div>
    </Container>
  );
}
