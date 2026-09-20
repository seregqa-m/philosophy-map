/* The MIT License

Copyright (c) 2020 8values. http://8values.github.io.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */
// Source: https://github.com/8values/8values.github.io/blob/master/ideologies.js
const politicalIdeologies = [
    {
        "name": "Anarcho-Communism",
        "stats": {
            "econ": 100,
            "dipl": 50,
            "govt": 100,
            "scty": 90
        }
    },
    {
        "name": "Libertarian Communism",
        "stats": {
            "econ": 100,
            "dipl": 70,
            "govt": 80,
            "scty": 80
        }
    },
    {
        "name": "Trotskyism",
        "stats": {
            "econ": 100,
            "dipl": 100,
            "govt": 60,
            "scty": 80
        }
    },
    {
        "name": "Marxism",
        "stats": {
            "econ": 100,
            "dipl": 70,
            "govt": 40,
            "scty": 80
        }
    },
    {
        "name": "De Leonism",
        "stats": {
            "econ": 100,
            "dipl": 30,
            "govt": 30,
            "scty": 80
        }
    },
    {
        "name": "Leninism",
        "stats": {
            "econ": 100,
            "dipl": 40,
            "govt": 20,
            "scty": 70
        }
    },
    {
        "name": "Stalinism/Maoism",
        "stats": {
            "econ": 100,
            "dipl": 20,
            "govt": 0,
            "scty": 60
        }
    },
    {
        "name": "Religious Communism",
        "stats": {
            "econ": 100,
            "dipl": 50,
            "govt": 30,
            "scty": 30
        }
    },
    {
        "name": "State Socialism",
        "stats": {
            "econ": 80,
            "dipl": 30,
            "govt": 30,
            "scty": 70
        }
    },
    {
        "name": "Theocratic Socialism",
        "stats": {
            "econ": 80,
            "dipl": 50,
            "govt": 30,
            "scty": 20
        }
    },
    {
        "name": "Religious Socialism",
        "stats": {
            "econ": 80,
            "dipl": 50,
            "govt": 70,
            "scty": 20
        }
    },
    {
        "name": "Democratic Socialism",
        "stats": {
            "econ": 80,
            "dipl": 50,
            "govt": 50,
            "scty": 80
        }
    },
    {
        "name": "Revolutionary Socialism",
        "stats": {
            "econ": 80,
            "dipl": 20,
            "govt": 50,
            "scty": 70
        }
    },
    {
        "name": "Libertarian Socialism",
        "stats": {
            "econ": 80,
            "dipl": 80,
            "govt": 80,
            "scty": 80
        }
    },
    {
        "name": "Anarcho-Syndicalism",
        "stats": {
            "econ": 80,
            "dipl": 50,
            "govt": 100,
            "scty": 80
        }
    },
    {
        "name": "Left-Wing Populism",
        "stats": {
            "econ": 60,
            "dipl": 40,
            "govt": 30,
            "scty": 70
        }
    },
    {
        "name": "Theocratic Distributism",
        "stats": {
            "econ": 60,
            "dipl": 40,
            "govt": 30,
            "scty": 20
        }
    },
    {
        "name": "Distributism",
        "stats": {
            "econ": 60,
            "dipl": 50,
            "govt": 50,
            "scty": 20
        }
    },
    {
        "name": "Social Liberalism",
        "stats": {
            "econ": 60,
            "dipl": 60,
            "govt": 60,
            "scty": 80
        }
    },
    {
        "name": "Christian Democracy",
        "stats": {
            "econ": 60,
            "dipl": 60,
            "govt": 50,
            "scty": 30
        }
    },
    {
        "name": "Social Democracy",
        "stats": {
            "econ": 60,
            "dipl": 70,
            "govt": 60,
            "scty": 80
        }
    },
    {
        "name": "Progressivism",
        "stats": {
            "econ": 60,
            "dipl": 80,
            "govt": 60,
            "scty": 100
        }
    },
    {
        "name": "Anarcho-Mutualism",
        "stats": {
            "econ": 60,
            "dipl": 50,
            "govt": 100,
            "scty": 70
        }
    },
    {
        "name": "National Totalitarianism",
        "stats": {
            "econ": 50,
            "dipl": 20,
            "govt": 0,
            "scty": 50
        }
    },
    {
        "name": "Global Totalitarianism",
        "stats": {
            "econ": 50,
            "dipl": 80,
            "govt": 0,
            "scty": 50
        }
    },
    {
        "name": "Technocracy",
        "stats": {
            "econ": 60,
            "dipl": 60,
            "govt": 20,
            "scty": 70
        }
    },
    {
        "name": "Centrist",
        "stats": {
            "econ": 50,
            "dipl": 50,
            "govt": 50,
            "scty": 50
        }
    },
    {
        "name": "Liberalism",
        "stats": {
            "econ": 50,
            "dipl": 60,
            "govt": 60,
            "scty": 60
        }
    },
    {
        "name": "Religious Anarchism",
        "stats": {
            "econ": 50,
            "dipl": 50,
            "govt": 100,
            "scty": 20
        }
    },
    {
        "name": "Right-Wing Populism",
        "stats": {
            "econ": 40,
            "dipl": 30,
            "govt": 30,
            "scty": 30
        }
    },
    {
        "name": "Moderate Conservatism",
        "stats": {
            "econ": 40,
            "dipl": 40,
            "govt": 50,
            "scty": 30
        }
    },
    {
        "name": "Reactionary",
        "stats": {
            "econ": 40,
            "dipl": 40,
            "govt": 40,
            "scty": 10
        }
    },
    {
        "name": "Social Libertarianism",
        "stats": {
            "econ": 60,
            "dipl": 70,
            "govt": 80,
            "scty": 70
        }
    },
    {
        "name": "Libertarianism",
        "stats": {
            "econ": 40,
            "dipl": 60,
            "govt": 80,
            "scty": 60
        }
    },
    {
        "name": "Anarcho-Egoism",
        "stats": {
            "econ": 40,
            "dipl": 50,
            "govt": 100,
            "scty": 50
        }
    },
    {
        "name": "Nazism",
        "stats": {
            "econ": 40,
            "dipl": 0,
            "govt": 0,
            "scty": 5
        }
    },
    {
        "name": "Autocracy",
        "stats": {
            "econ": 50,
            "dipl": 20,
            "govt": 20,
            "scty": 50
        }
    },
    {
        "name": "Fascism",
        "stats": {
            "econ": 40,
            "dipl": 20,
            "govt": 20,
            "scty": 20
        }
    },
    {
        "name": "Capitalist Fascism",
        "stats": {
            "econ": 20,
            "dipl": 20,
            "govt": 20,
            "scty": 20
        }
    },
    {
        "name": "Conservatism",
        "stats": {
            "econ": 30,
            "dipl": 40,
            "govt": 40,
            "scty": 20
        }
    },
    {
        "name": "Neo-Liberalism",
        "stats": {
            "econ": 30,
            "dipl": 30,
            "govt": 50,
            "scty": 60
        }
    },
    {
        "name": "Classical Liberalism",
        "stats": {
            "econ": 30,
            "dipl": 60,
            "govt": 60,
            "scty": 80
        }
    },
    {
        "name": "Authoritarian Capitalism",
        "stats": {
            "econ": 20,
            "dipl": 30,
            "govt": 20,
            "scty": 40
        }
    },
    {
        "name": "State Capitalism",
        "stats": {
            "econ": 20,
            "dipl": 50,
            "govt": 30,
            "scty": 50
        }
    },
    {
        "name": "Neo-Conservatism",
        "stats": {
            "econ": 20,
            "dipl": 20,
            "govt": 40,
            "scty": 20
        }
    },
    {
        "name": "Fundamentalism",
        "stats": {
            "econ": 20,
            "dipl": 30,
            "govt": 30,
            "scty": 5
        }
    },
    {
        "name": "Libertarian Capitalism",
        "stats": {
            "econ": 20,
            "dipl": 50,
            "govt": 80,
            "scty": 60
        }
    },
    {
        "name": "Market Anarchism",
        "stats": {
            "econ": 20,
            "dipl": 50,
            "govt": 100,
            "scty": 50
        }
    },
    {
        "name": "Objectivism",
        "stats": {
            "econ": 10,
            "dipl": 50,
            "govt": 90,
            "scty": 40
        }
    },
    {
        "name": "Totalitarian Capitalism",
        "stats": {
            "econ": 0,
            "dipl": 30,
            "govt": 0,
            "scty": 50
        }
    },
    {
        "name": "Ultra-Capitalism",
        "stats": {
            "econ": 0,
            "dipl": 40,
            "govt": 50,
            "scty": 50
        }
    },
    {
        "name": "Anarcho-Capitalism",
        "stats": {
            "econ": 0,
            "dipl": 50,
            "govt": 100,
            "scty": 50
        }
    }
];
