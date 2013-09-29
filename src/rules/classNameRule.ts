/*
 * Copyright 2013 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

/// <reference path='../language/rule/rule.ts'/>
/// <reference path='../language/rule/abstractRule.ts'/>

module Lint.Rules {

    export class ClassNameRule extends AbstractRule {
        static FAILURE_STRING = "name must be in pascal case";

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            return this.applyWithWalker(new NameWalker(syntaxTree));
        }
    }

    class NameWalker extends Lint.RuleWalker {
        public visitClassDeclaration(node: TypeScript.ClassDeclarationSyntax): void {
            var className = node.identifier.text();
            if (!this.isPascalCased(className)) {
                var position = this.positionAfter(node.modifiers, node.classKeyword);
                this.addFailureAt(position, node.identifier.width());
            }

            super.visitClassDeclaration(node);
        }

        public visitInterfaceDeclaration(node: TypeScript.InterfaceDeclarationSyntax): void {
            var interfaceName = node.identifier.text();
            if (!this.isPascalCased(interfaceName)) {
                var position = this.positionAfter(node.modifiers, node.interfaceKeyword);
                this.addFailureAt(position, node.identifier.width());
            }

            super.visitInterfaceDeclaration(node);
        }

        private isPascalCased(name): boolean {
            if (name.length <= 0) {
                return true;
            }

            var firstCharacter = name.charAt(0);
            return ((firstCharacter === firstCharacter.toUpperCase()) && name.indexOf("_") === -1);
        }

        private addFailureAt(position, width) {
            var failure = this.createFailure(position, width, ClassNameRule.FAILURE_STRING);
            this.addFailure(failure);
        }

    }

}
