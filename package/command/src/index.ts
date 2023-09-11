#!/usr/bin/env node

import process from 'node:process'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { Command } from 'commander'
import { copySync, symlink } from 'fs-extra'
import pkg from '../package.json'
import { exec } from './exec'

const program = new Command()

program
  .name(pkg.name)
  .description(pkg.description)
  .version(pkg.version)

program
  .command('create')
  .arguments('projectName')
  .description('create a web project')
  .action(async (projectName: string) => {
    const targetPath = resolve(process.cwd(), projectName)
    await mkdir(targetPath)
    try {
      const templatePath = resolve(__dirname, 'template')
      copySync(templatePath, targetPath)
    }
    catch (err) {
      console.error(err)
    }
  })

program
  .command('install')
  .description('Install dependencies')
  .action(async () => {
    const cwd = process.cwd()
    const targetpath = resolve(cwd, '.react-web')
    await exec({ cli: 'ni', cwd: targetpath })
    const linkSourcePath = resolve(targetpath, 'node_modules')
    const linkTargetPath = resolve(cwd, 'node_modules')
    await symlink(linkSourcePath, linkTargetPath)
  })

program.parse()
