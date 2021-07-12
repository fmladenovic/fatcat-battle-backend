FROM debian AS development

SHELL [ "/bin/bash", "-l", "-c" ]

WORKDIR /usr/src/app

RUN apt-get update; \
    apt-get full-upgrade -y; \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        procps \
    ; \
    apt-get clean; \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY .nvmrc ./

# install and start nvm
ENV NVM_DIR /usr/local/nvm

RUN mkdir -p "$NVM_DIR"; \
    curl -o- \
        "https://raw.githubusercontent.com/creationix/nvm/master/install.sh" | \
        bash \
    ; \
    source $NVM_DIR/nvm.sh; \
    nvm install; \
    nvm use;

RUN command -v nvm; \
    command -v node; \
    node --version; \
    command -v npm; \
    npm --version;

RUN npm ci --only=development

COPY . .
RUN npm run build
