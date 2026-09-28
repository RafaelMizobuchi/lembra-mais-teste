# mobile-android

App Android nativo do paciente, em Java. Responsável: Front-end 2.

## Por que esta pasta está vazia

Um projeto Android precisa do Gradle Wrapper e dos arquivos gerados pelo
próprio Android Studio para abrir e buildar direito. Montar isso na mão sem o
Studio costuma dar problema de versão do SDK/Gradle. Em vez disso, gere o
projeto pelo wizard e ele será commitado aqui.

## Como criar o projeto (uma vez, quem for tocar esta parte)

1. Abra o Android Studio → **New Project** → template **Empty Views Activity**.
2. Configure exatamente assim, para bater com o resto do repositório:
   - **Name**: `Lembra+`
   - **Package name**: `com.lembramais`
   - **Save location**: esta pasta (`.../lembra-mais/mobile-android`)
   - **Language**: **Java**
   - **Minimum SDK**: API 26 (Android 8.0) — cobre a grande maioria dos
     aparelhos sem perder recursos modernos de notificação.
3. Depois de criado, adicione as dependências no `app/build.gradle`:
   ```gradle
   implementation 'com.squareup.retrofit2:retrofit:2.11.0'
   implementation 'com.squareup.retrofit2:converter-gson:2.11.0'
   implementation 'androidx.room:room-runtime:2.6.1'
   annotationProcessor 'androidx.room:room-compiler:2.6.1'
   implementation platform('com.google.firebase:firebase-bom:33.1.2')
   implementation 'com.google.firebase:firebase-messaging'
   ```
4. Pacotes sugeridos dentro de `app/src/main/java/com/lembramais/`:
   - `auth/` — telas de login/cadastro, chamando o mesmo endpoint do
     front-end web
   - `schedule/` — agenda diária e confirmação de dose
   - `medication/` — cadastro de medicamentos
   - `network/` — cliente Retrofit apontando para a API do `backend/`
5. Commit normal: `git add mobile-android`, PR revisado pela dupla de
   front-end.

Ver a stack completa e o roadmap em [`../docs/roteiro.md`](../docs/roteiro.md).
