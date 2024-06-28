FROM amd64/ubuntu

RUN apt-get update && \
    apt-get install -y curl wget build-essential libssl-dev

ENV NVM_DIR /usr/local/nvm

# Install NVM
RUN mkdir -p $NVM_DIR && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# Activate NVM for future shell sessions
ENV BASH_ENV $NVM_DIR/nvm.sh
RUN echo 'source $NVM_DIR/nvm.sh' >> /etc/bash.bashrc
RUN echo 'source $NVM_DIR/bash_completion' >> /etc/bash.bashrc

ENV NODE_VERSION 16.0.0
RUN /bin/bash -c "source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm alias default $NODE_VERSION && nvm use default"


RUN mkdir Frontend
WORKDIR /Frontend
COPY ./Frontend ./
EXPOSE 3000
RUN ["/bin/bash", "-c", "npm install"]
RUN ["/bin/bash", "-c", "npm install http-proxy-middleware"]
RUN ["/bin/bash", "-c", "npm install --save react-google-charts"]
RUN ["/bin/bash", "-c", "npm install react-router-dom"]
CMD ["/bin/bash", "-c", "npm start"]
