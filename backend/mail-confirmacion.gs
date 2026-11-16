/**
 * FLAY 2027 · Mail automático de confirmación de inscripción
 *
 * Proyecto de Apps Script en la cuenta flay.acroyoga@gmail.com (los mails salen de ahí).
 * Escucha el formulario "Inscribirme a FLAY 2027" y, cada vez que alguien se anota
 * (desde la web o desde el formulario), le manda un mail de bienvenida.
 *
 * Para instalarlo: pegar este código, ejecutar una vez la función `instalar` y aceptar permisos.
 */

const FORM_ID = "1QuPDmNZ53awUW6lgMa2qcn2Pl0xa-BSh-O3Z-2zc2Xk";
const WEB = "https://clubdelacro1.github.io/flay/";

function instalar() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("alInscribirse").forForm(FORM_ID).onFormSubmit().create();
}

function alInscribirse(e) {
  const items = e.response.getItemResponses();
  const get = inicio => {
    const it = items.find(i => i.getItem().getTitle().trim().toLowerCase().startsWith(inicio));
    return it ? String(it.getResponse()).trim() : "";
  };

  const email = get("correo") || e.response.getRespondentEmail();
  if (!email || !/@/.test(email)) return;

  const nombre = (get("nombre").split(/\s+/)[0] || "").replace(/^./, c => c.toUpperCase());
  const opcion = get("opciones de precios");
  let plan = opcion;
  if (/^1550/.test(opcion)) plan = "Camping · USD 1.550";
  else if (/^1750/.test(opcion)) plan = "Habitación compartida en la posada · USD 1.750";

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;color:#2b2540;line-height:1.55">
    <div style="background:#7d6bb3;color:#fff;padding:26px 28px;border-radius:14px 14px 0 0">
      <div style="font-size:13px;letter-spacing:2px;opacity:.85">FORMACIÓN LATINOAMERICANA DE ACROYOGA</div>
      <div style="font-size:26px;font-weight:bold;margin-top:6px">¡Bienvenidx a FLAY 2027!</div>
    </div>
    <div style="background:#faf8ff;padding:26px 28px;border-radius:0 0 14px 14px;border:1px solid #e6e0f5;border-top:0">
      <p>Hola${nombre ? " " + nombre : ""}:</p>
      <p>¡Recibimos tu inscripción! Nos llena de alegría que quieras ser parte de esta formación.</p>
      <table style="width:100%;border-collapse:collapse;margin:18px 0;font-size:15px">
        <tr><td style="padding:7px 0;color:#7a7390">Fechas</td><td style="padding:7px 0;text-align:right"><b>3 al 14 de febrero de 2027</b></td></tr>
        <tr><td style="padding:7px 0;color:#7a7390;border-top:1px solid #e6e0f5">Lugar</td><td style="padding:7px 0;text-align:right;border-top:1px solid #e6e0f5"><b>Casa Buda, Traslasierra (Córdoba)</b></td></tr>
        ${plan ? `<tr><td style="padding:7px 0;color:#7a7390;border-top:1px solid #e6e0f5">Elegiste</td><td style="padding:7px 0;text-align:right;border-top:1px solid #e6e0f5"><b>${plan}</b></td></tr>` : ""}
      </table>
      <p><b>¿Qué sigue?</b> En los próximos días te escribimos con los datos de pago. Con la <b>seña de USD 300</b> congelás el precio y tu lugar queda reservado.</p>
      <p>Si tenés cualquier duda, respondé este mail o escribinos por WhatsApp:<br>
        Coni · <a href="https://wa.me/5491138948106" style="color:#7d6bb3">+54 9 11 3894-8106</a><br>
        Rober · <a href="https://wa.me/5491123357818" style="color:#7d6bb3">+54 9 11 2335-7818</a></p>
      <p style="margin-top:24px">¡Nos vemos en las sierras!<br><b>Equipo FLAY</b><br>Coni, Ro, Rober y Stefi</p>
      <p style="font-size:12px;color:#7a7390;margin-top:22px"><a href="${WEB}" style="color:#7a7390">${WEB.replace("https://", "")}</a></p>
    </div>
  </div>`;

  MailApp.sendEmail({
    to: email,
    subject: "¡Bienvenidx a FLAY 2027! Recibimos tu inscripción",
    name: "FLAY · Formación Latinoamericana de Acroyoga",
    htmlBody: html,
    body: `Hola${nombre ? " " + nombre : ""}: recibimos tu inscripción a FLAY 2027 (3 al 14 de febrero, Casa Buda, Traslasierra). ${plan ? "Elegiste: " + plan + ". " : ""}En los próximos días te escribimos con los datos de pago; con la seña de USD 300 congelás el precio. Dudas: respondé este mail o WhatsApp Coni +54 9 11 3894-8106 / Rober +54 9 11 2335-7818. ¡Nos vemos en las sierras! Equipo FLAY`,
  });
}
