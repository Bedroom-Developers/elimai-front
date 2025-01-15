# Use a Node.js base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy project files
COPY . .

# Ensure Yarn Berry is available
# This copies your project's Yarn Berry binary (from .yarn/releases)
COPY .yarn/releases/yarn-*.cjs .yarn/releases/
COPY .yarnrc.yml .

# Install dependencies using Yarn Berry
RUN yarn install --immutable

# Build the project (if applicable)
RUN yarn build

# Specify the default command
CMD ["yarn", "start"]
