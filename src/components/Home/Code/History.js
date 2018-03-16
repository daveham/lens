import React from 'react';

export default () => {
  return (
    <div>
      <p>
        There was an earlier version of this tool written in .NET.
        It had the same goal as this project - a learning environment
        for new software technologies as well as a non-trivial project
        to learn and explore various algorithms in emergent behavior.
        Of course, in the earlier version the software technologies were those
        in the Microsoft stack, and the project was a means to ramp up on the
        latest versions of C# and the .NET runtime.
      </p>
      <p>
        The first incarnation of Lens was a client-only program, focused on
        simulation and rendering. It did not include a user interface
        - everything was handled via the command line.
      </p>
      <p>
        During development of this version, I transitioned from working on Windows
        to working on OSX. So part of the learning and exploration was in moving
        a non-trivial application from .NET on Windows to .NET on OSX via Mono.
      </p>
      <p>
        The rendering phase in the .NET version of Lens was off-loaded to a number of
        external graphics tools. (This was primarily driven by the fact that
        I was working on OSX and could get much better rendering from tools that
        already worked well on OSX.) These tools included <a
        href='http://processingjs.org/'>Processing</a> and <a
        href='https://www.nodebox.net/'>Nodebox</a>, version 1.
        Rendering consisted of exporting data and code that could be executed by the
        external tool to produce the final output. (For Processing, the code is
        a subset of Java. For Nodebox, the code is a subset of python.)
      </p>
      <p>
        The .NET version of Lens remains in a private GitHub repo. I currently have no
        plans to make it public.
      </p>
    </div>
  );
};
