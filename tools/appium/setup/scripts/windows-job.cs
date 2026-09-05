// Own the server tree before its first instruction executes. A non-inheritable
// KILL_ON_JOB_CLOSE handle also covers supervisor crashes and parent exits.
using System;
using System.ComponentModel;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;

public static class AppiumWindowsJob {
    public static bool OwnerExited { get; private set; }
    [StructLayout(LayoutKind.Sequential)] struct Limits {
        public long ProcessTime, JobTime;
        public uint Flags;
        public UIntPtr MinWorkingSet, MaxWorkingSet;
        public uint ActiveProcessLimit;
        public UIntPtr Affinity;
        public uint PriorityClass, SchedulingClass;
    }
    [StructLayout(LayoutKind.Sequential)] struct IoCounters {
        public ulong ReadOps, WriteOps, OtherOps, ReadBytes, WriteBytes, OtherBytes;
    }
    [StructLayout(LayoutKind.Sequential)] struct ExtendedLimits {
        public Limits Basic;
        public IoCounters Io;
        public UIntPtr ProcessMemory, JobMemory, PeakProcessMemory, PeakJobMemory;
    }
    [StructLayout(LayoutKind.Sequential)] struct Accounting {
        public long UserTime, KernelTime, PeriodUserTime, PeriodKernelTime;
        public uint PageFaults, TotalProcesses, ActiveProcesses, TerminatedProcesses;
    }
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)] struct Startup {
        public uint Size;
        public string Reserved, Desktop, Title;
        public uint X, Y, XSize, YSize, XChars, YChars, FillAttribute, Flags;
        public ushort ShowWindow, ReservedSize;
        public IntPtr ReservedBytes, Stdin, Stdout, Stderr;
    }
    [StructLayout(LayoutKind.Sequential)] struct ProcessInfo {
        public IntPtr Process, Thread;
        public uint ProcessId, ThreadId;
    }
    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    static extern IntPtr CreateJobObject(IntPtr attributes, string name);
    [DllImport("kernel32.dll", SetLastError = true)]
    static extern bool SetInformationJobObject(IntPtr job, int kind, ref ExtendedLimits limits, uint size);
    [DllImport("kernel32.dll", SetLastError = true)]
    static extern bool QueryInformationJobObject(IntPtr job, int kind, ref Accounting accounting, uint size, IntPtr length);
    [DllImport("kernel32.dll", SetLastError = true)]
    static extern bool AssignProcessToJobObject(IntPtr job, IntPtr process);
    [DllImport("kernel32.dll", SetLastError = true)]
    static extern bool TerminateJobObject(IntPtr job, uint code);
    [DllImport("kernel32.dll", SetLastError = true)]
    static extern bool TerminateProcess(IntPtr process, uint code);
    [DllImport("kernel32.dll", SetLastError = true)]
    static extern uint ResumeThread(IntPtr thread);
    [DllImport("kernel32.dll")] static extern uint WaitForSingleObject(IntPtr handle, uint milliseconds);
    [DllImport("kernel32.dll")] static extern IntPtr GetStdHandle(int number);
    [DllImport("kernel32.dll", SetLastError = true)]
    static extern bool SetHandleInformation(IntPtr handle, uint mask, uint flags);
    [DllImport("kernel32.dll")] static extern bool CloseHandle(IntPtr handle);
    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    static extern bool CreateProcess(string application, StringBuilder commandLine,
        IntPtr processAttributes, IntPtr threadAttributes, bool inheritHandles, uint flags,
        IntPtr environment, string directory, ref Startup startup, out ProcessInfo process);

    static void Check(bool ok) { if (!ok) throw new Win32Exception(Marshal.GetLastWin32Error()); }

    public static bool Run(string executable, string commandLine, int parentId, string stopFile, int timeoutMs) {
        IntPtr job = IntPtr.Zero;
        ProcessInfo child = new ProcessInfo();
        bool assigned = false;
        // Hold a process handle so PID reuse cannot substitute another parent.
        using (Process parent = Process.GetProcessById(parentId)) {
            IntPtr parentHandle = parent.Handle;
            try {
                job = CreateJobObject(IntPtr.Zero, null);
                Check(job != IntPtr.Zero);
                ExtendedLimits limits = new ExtendedLimits();
                limits.Basic.Flags = 0x2000; // JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE
                Check(SetInformationJobObject(job, 9, ref limits, (uint)Marshal.SizeOf(limits)));
                Startup startup = new Startup();
                startup.Size = (uint)Marshal.SizeOf(startup);
                startup.Flags = 0x100; // STARTF_USESTDHANDLES
                startup.Stdin = GetStdHandle(-10);
                startup.Stdout = GetStdHandle(-11);
                startup.Stderr = GetStdHandle(-12);
                foreach (IntPtr handle in new IntPtr[] { startup.Stdin, startup.Stdout, startup.Stderr })
                    Check(SetHandleInformation(handle, 1, 1));
                Check(CreateProcess(executable, new StringBuilder(commandLine), IntPtr.Zero, IntPtr.Zero,
                    true, 0x08000004, IntPtr.Zero, null, ref startup, out child)); // NO_WINDOW | SUSPENDED
                Check(AssignProcessToJobObject(job, child.Process));
                assigned = true;
                Check(ResumeThread(child.Thread) != UInt32.MaxValue);
                while (!File.Exists(stopFile) && WaitForSingleObject(parentHandle, 0) == 258 &&
                       WaitForSingleObject(child.Process, 0) == 258) Thread.Sleep(25);
                OwnerExited = WaitForSingleObject(parentHandle, 0) == 0;
                Check(TerminateJobObject(job, 1));
                Stopwatch clock = Stopwatch.StartNew();
                do {
                    Accounting accounting = new Accounting();
                    Check(QueryInformationJobObject(job, 1, ref accounting, (uint)Marshal.SizeOf(accounting), IntPtr.Zero));
                    if (accounting.ActiveProcesses == 0) return true;
                    Thread.Sleep(25);
                } while (clock.ElapsedMilliseconds < timeoutMs);
                return false;
            } finally {
                // Assignment failure must not leave the suspended process behind.
                if (!assigned && child.Process != IntPtr.Zero) TerminateProcess(child.Process, 1);
                if (child.Thread != IntPtr.Zero) CloseHandle(child.Thread);
                if (child.Process != IntPtr.Zero) CloseHandle(child.Process);
                if (job != IntPtr.Zero) CloseHandle(job);
            }
        }
    }
}
